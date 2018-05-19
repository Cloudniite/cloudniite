const AWS = require('aws-sdk');
const Mustache = require('mustache');
var fs = require("fs");
const path = require('path');
const { exec } = require('child_process');

const lambdaController = {
    functionList: "",
    tagGroups: {},
    allFunctionData: {},
    htmlViz: "",
    lambda: "",
    cloudwatch: "",
    allFunctions: {},
};

lambdaController.configure = function (region, IdentityPoolId, apiVersionLambda = '2015-03-31', apiVersionCloudW = '2010-08-01') {
    return new Promise((resolve, reject) => {
        executeAWSCommand().then(() => {
            AWS.config.update({ region: region });
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: IdentityPoolId });
            this.lambda = new AWS.Lambda({ region: region, apiVersion: apiVersionLambda });
            this.cloudwatch = new AWS.CloudWatch({ region: region, apiVersion: apiVersionCloudW });
            lambdaController.setFunctionList(this.functionList);

            return resolve();
        })
    });
}

lambdaController.setFunctionList = function (functionList) {
    functionList.Functions.forEach((func) => {
        this.allFunctions[func.FunctionName.split('-')[1]] = func.FunctionName;
    });
    renderTemplate();
}

function executeAWSCommand() {
    return new Promise((resolve, reject) => {
        exec('aws lambda list-functions', (err, stdout, stderr) => {
            if (err) {
                console.log("ERROR HERE");
                // node couldn't execute the command
                return;
            }

            // the *entire* stdout and stderr (buffered)
            lambdaController.functionList = JSON.parse(stdout);
            return resolve();
        });
    });
}

//build a Mustache template to inject with function data and metrics 
//for monitoring and optimization 
function renderTemplate() {
    lambdaController.getAllFuncInfo()
        .then(lambdaController.getInvocationInfo())
        .then(() => {

            var functionArray = [];
            var tagsArray = [];

            var view = {
                function: functionArray,
                tagsArray: tagsArray,
                rawTimeDurationData: JSON.stringify(lambdaController.allFunctionData),
                totalFunctionCount: 0,
                totalTagGroupCount: 0,
                mostUsedCount: 0,
                mostUsedName: '',
                leastUsedCount: Infinity,
                leastUsedName: '',
            };

            //count the functions 
            (function (){
                Object.keys(lambdaController.allFunctionData).forEach((f) => {
                    return view.totalFunctionCount += 1;
                })
            })();

            //count the tag groups 
            (function(){
                Object.keys(lambdaController.tagGroups).forEach((f) => {
                    return view.totalTagGroupCount += 1;
                })
            })();

            //calculate the slowest function here
            (function freqFunction(){
                Object.keys(lambdaController.allFunctionData).forEach((funcName) => {
                    var durationArr = lambdaController.allFunctionData[funcName].durationSeries;
                    if (durationArr.length >= view.mostUsedCount){
                        view.mostUsedCount = durationArr.length;
                        view.mostUsedName = funcName;
                    }

                    if (durationArr.length <= view.leastUsedCount){
                        view.leastUsedCount = durationArr.length;
                        view.leastUsedName = funcName;
                    }

                })
            })();

            function tableStats(idx, shortHandFunc, array) {
                var timeDuration = lambdaController.allFunctionData[shortHandFunc].durationSeries;
                for (var i = 0; i < timeDuration.length; i++) {
                    var date = new Date(timeDuration[i].date);
                    date = date.toUTCString();
                    date = date.split(' ').slice(0, 5).join(' ');
                    array[idx] += `
                    <tr>
                        <td style = "font-weight: 400"> ${date}</td> 
                        <td style = "font-weight: 400">${precisionRound(timeDuration[i].duration, 3)} ms</td> 
                    </tr>`;
                }
                array[idx] += `</table></div>`;
            }

            lambdaController.functionList.Functions.forEach((func, idx) => {
                var shortHandFunc = func.FunctionName.split('-')[1]
                functionArray[idx] = `
            <button style = "margin-bottom: 2%;" class="functions" ${shortHandFunc}">
                <b>Function Name</b>: ${shortHandFunc}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                <b> Tag Groups</b>: `;
                for (var tagGroup in lambdaController.tagGroups) {
                    if (lambdaController.tagGroups[tagGroup].includes(func.FunctionName)) {
                        functionArray[idx] += ` - ${tagGroup}`
                    }
                }
                functionArray[idx] += `</button>
            <div class="function-data-outer" style=" display: none;"> 
            <form>
                <div class = "graphButton">
                    <input name = "functionStats" type="radio" value="Graph" onclick="showGraph(event, '${shortHandFunc + 'graph1'}')" checked> Graph </input>
                </div>
                <div class = "tableButton">
                    <input name = "functionStats" type="radio" value="Table" onclick="showTable(event, '${shortHandFunc + 'table'}')"> Table </input>
                </div>
            </form>
            <div class="function-info-box">
                <p>Function Data</p>
                <ul>
                   <li>Memory size: ${lambdaController.allFunctionData[shortHandFunc].MemorySize} MB</li>
                    <li>Code size: ${lambdaController.allFunctionData[shortHandFunc].codeSize} MB</li>
                    <li>Runtime environment: ${lambdaController.allFunctionData[shortHandFunc].runTimeEnv}</li>
                    <li>Last Modified: ${new Date(lambdaController.allFunctionData[shortHandFunc].lastModified)}</li>
                </ul>
               </div>
               <div class="function-viz-outer">
                <div class = "${shortHandFunc + 'table'} hide" style = "overflow-y: auto; height: 400px;">
                    <table style = "width: 80%; text-align: center;">
                        <tr style = "">
                            <th style = "font-weight: bold">Invoked</th>
                            <th style = "font-weight: bold">Duration</th>
                        </tr>`
                tableStats(idx, shortHandFunc, functionArray);
                functionArray[idx] += `
                <div class = "${shortHandFunc + 'graph1'}" >
                </div>
            </div></div>`;
            });

            Object.keys(lambdaController.tagGroups).forEach((tag, idx) => {
                tagsArray[idx] = (`<button style = "margin-bottom: 2%;" class="tags" id = "${tag}" ><b> Tag Groups</b>: ${tag} </button> <div style="display: none;">`);
                lambdaController.tagGroups[tag].forEach((functionName) => {
                    var shortFunctionName = functionName.split('-')[1];
                    tagsArray[idx] += `<button class = "tagFunction" style = "margin-top: 2%; border-radius: 4px;">${shortFunctionName}</button> 
                <div class="function-data-outer" style=" display: none;"> 
                <form>
                    <div class = "graphButton">
                        <input name = "functionStats" type="radio" value="Graph" onclick="showGraph2(event, '${shortFunctionName + 'graph2'}')" checked> Graph </input>
                    </div>
                    <div class = "tableButton">
                        <input name = "functionStats" type="radio" value="Table" onclick="showTable2(event, '${shortFunctionName + 'table2'}')"> Table </input>
                    </div>
                </form>
                <div class="function-info-box">
                <p>Function Data</p>
                <ul>
                   <li>Memory size: ${lambdaController.allFunctionData[shortFunctionName].MemorySize} MB</li>
                    <li>Code size: ${lambdaController.allFunctionData[shortFunctionName].codeSize} MB</li>
                    <li>Runtime environment: ${lambdaController.allFunctionData[shortFunctionName].runTimeEnv}</li>
                    <li>Last Modified: ${new Date(lambdaController.allFunctionData[shortFunctionName].lastModified)}</li>
                </ul>
               </div>
               <div class="function-viz-outer">
                <div class = "${shortFunctionName + 'table2'} hide" style = "overflow-y: auto; height: 400px;">
                    <table style = "width: 80%; text-align: center;">
                        <tr>
                            <th style = "font-weight: bold">Invoked</th>
                            <th style = "font-weight: bold">Duration</th>
                        </tr>`;
                    tableStats(idx, shortFunctionName, tagsArray);
                    tagsArray[idx] += `<div class = "${shortFunctionName + 'graph2'}"></div></div>`;
                });
                tagsArray[idx] += `</div></div>`;
            })


            fs.readFile(path.join(__dirname, 'index.mustache'), 'utf-8', function (err, html) {
                if (err) throw err;
                var output = Mustache.to_html(html, view);
                this.htmlViz = output;
            });
        }).catch((error) => { console.error(`FAILED: Adding to html failed, ${error}`) });
}

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

lambdaController.getHtmlViz = function (req, res) {
    res.send(this.htmlViz);
}

function cloudWatchParams(funcName, metricName) {
    this.EndTime = new Date,
        this.MetricDataQueries = [
            {
                Id: 'testMetric',
                MetricStat: {
                    Metric: {
                        Dimensions: [{ Name: 'FunctionName', Value: funcName }],
                        MetricName: metricName,
                        Namespace: 'AWS/Lambda'
                    },
                    Period: 60,
                    Stat: 'Average',
                },
                ReturnData: true || false
            }
        ];
    this.StartTime = 0
}

lambdaController.getAllFuncInfo = function (req, res) {
    var newFunctions = this.functionList.Functions.map(func => {
        //create new key inside allFunctionData object on the lambdaController
        //and fill with function information from the functionList
        this.allFunctionData[func.FunctionName.split('-')[1]] = {
            durationSeries: [],
            MemorySize: func.MemorySize,
            codeSize: func.CodeSize,
            runTimeEnv: func.Runtime,
            lastModified: func.LastModified
        };

        //create promises for each function to retrieve duration data from 
        //AWS Cloudwatch
        return new Promise((resolve) => {
            this.cloudwatch.getMetricData(new cloudWatchParams(func.FunctionName, 'Duration'), (err, data) => {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    for (var i = data.MetricDataResults[0].Values.length - 1; i >= 0; i--) {
                        var funcName = func.FunctionName.split('-')[1];
                        var date = data.MetricDataResults[0].Timestamps[i];
                        var duration = data.MetricDataResults[0].Values[i];
                        var singleDurationData = { date: new Date(date), duration: duration };
                        this.allFunctionData[funcName].durationSeries.push(singleDurationData); // successful response
                    }
                    return resolve();
                }
            });
        })
    });

    //wait until all promises have resolved 
    return Promise.all(newFunctions)
        .then(() => { })
        .catch((error) => { console.error(`FAILED: error retrieving data, ${error}`) });
}

lambdaController.getInvocationInfo = function () {
    var newFunctions = this.functionList.Functions.map(func => {
        //create new key inside allFunctionData object on the lambdaController
        //and fill with function information from the functionList
        this.allFunctionData[func.FunctionName.split('-')[1]].invocationSeries = [];

        //create promises for each function to retrieve duration data from 
        //AWS Cloudwatch
        return new Promise((resolve) => {
            this.cloudwatch.getMetricData(new cloudWatchParams(func.FunctionName, 'Invocations'), (err, data) => {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    for (var i = data.MetricDataResults[0].Values.length - 1; i >= 0; i--) {
                        var funcName = func.FunctionName.split('-')[1];
                        var date = data.MetricDataResults[0].Timestamps[i];
                        var invocation = data.MetricDataResults[0].Values[i];
                        var singleInvocationData = { date: new Date(date), invocation: invocation };
                        this.allFunctionData[funcName].invocationSeries.push(singleInvocationData); // successful response
                    }
                    return resolve();
                }
            });
        })
    })
    //wait until all promises have resolved 
    return Promise.all(newFunctions)
        .then(() => { })
        .catch((error) => { console.error(`FAILED: error retrieving data, ${error}`) });
}

lambdaController.getAwsFunctions = function (...rest) {
    const awsFunctionNames = [];
    rest.forEach((restFunc) => {
        if (this.allFunctions[restFunc]) {
            awsFunctionNames.push(this.allFunctions[restFunc])
        } else {
            console.error(`Error creating tag group for function ${restFunc}. Function ${restFunc} doesn't exist!`);
        };
    })

    return awsFunctionNames;
}

function failedType(method, timer = null, tagGroup = "") {
    if (typeof timer !== 'number' && timer !== null) {
        console.error(`FAILED at ${method}: First argument should be a number specifying the timer or null for single execution`);
        return true;
    }
    if (typeof tagGroup !== 'string') {
        console.error(`FAILED at ${method}: First argument should be a string specifying the category`);
        return true;
    }
}

lambdaController.createTagGroup = function (tagGroup, ...rest) {
    if (failedType('createTagGroup', null, tagGroup)) return;
    if (!(tagGroup in this.tagGroups)) {
        this.tagGroups[tagGroup] = this.getAwsFunctions(...rest);
    } else {
        console.error("FAILED at createTagGroup: Tag group already exists");
    }
};

lambdaController.addToTagGroup = function (tagGroup, ...rest) {
    if (typeof tagGroup !== 'string') return console.error('FAILED at createTagGroup: First argument should be a string specifying the category');
    if (!(tagGroup in this.tagGroups)) {
        console.error("FAILED at addToTagGroup: Tag group doesn't exists");
    } else {
        this.tagGroups[tagGroup] = this.tagGroups[tagGroup].concat(this.getAwsFunctions(...rest));
    }
};

function pullParams(funcName) {
    this.FunctionName = funcName,
        this.InvocationType = 'RequestResponse',
        this.LogType = 'None',
        this.Payload = '{"source" : "Cloudniite-Warmup"}'
};

lambdaController.warmupFunctions = function (timer, ...rest) {
    if (failedType('warmupFunctions', timer)) return;
    var functions = this.getAwsFunctions(...rest);
    const createfunc = () => {
        var newFunctions = functions.map((func) => {
            return new Promise((resolve) => {
                this.lambda.invoke(new pullParams(func), (error, data) => {
                    if (error) {
                        throw error;
                    } else {
                        resolve();
                    }
                });
            })
        });
        return newFunctions;
    }

    var promiseCall = () => {
        Promise.all(createfunc())
            .then(() => console.log(`Warmup of function/s ${rest} complete`))
            .catch((error) => { console.error(`FAILED: Warmup of function/s ${rest} failed, ${error}`) });
    }
    promiseCall();
    if (timer !== null && timer > 0) setInterval(() => { promiseCall(); }, (timer * 60000));
}

lambdaController.warmupTagGroup = function (timer = null, tagGroup) {
    if (typeof timer !== 'number' && timer !== null) return console.error(`FAILED at warmupTagGroup: First argument should be a number specifying the timer or null for single execution`);
    if (typeof tagGroup !== 'string') return console.error('FAILED at warmupTagGroup: First argument should be a string specifying the category');
    if (!(tagGroup in this.tagGroups)) return console.error(`FAILED at warmupTagGroup: ${tagGroup} is invalid`);
    const functions = this.tagGroups[tagGroup];
    const createFunc = () => {
        var newFunctions = functions.map((func) => {
            return new Promise((resolve) => {
                this.lambda.invoke(new pullParams(func), (error, data) => {
                    if (error) {
                        throw error;
                    } else {
                        resolve();
                    }
                });
            })
        });
        return newFunctions;
    }

    const promiseCall = () => {
        Promise.all(createFunc())
            .then(() => {
                console.log(`Warmup of category ${tagGroup} complete`)
            })
            .catch((error) => { console.error(`FAILED: Warmup of category ${tagGroup} failed, ${error}`) });
    }

    promiseCall();
    if (timer !== null && timer > 0) setInterval(() => { promiseCall() }, (timer * 60000));
}

module.exports = lambdaController;