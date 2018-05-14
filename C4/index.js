const AWS = require('aws-sdk');
const Mustache = require('mustache');
var fs = require("fs");
const path = require('path');

const lambdaController = { 
    functionList: "", 
    tagGroups: {}, 
    timeAndDuration: [], 
    htmlViz: "", 
    lambda: "", 
    allFunctions: {}, 
};

var cloudwatch = new AWS.CloudWatch({ region: 'us-east-1', apiVersion: '2010-08-01' });

lambdaController.configure = function (region, IdentityPoolId, apiVersion = '2015-03-31') {
    AWS.config.update({ region: region });
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: IdentityPoolId });
    this.lambda = new AWS.Lambda({ region: region, apiVersion: apiVersion });
}

function renderTemplate() {
    lambdaController.getAllFuncInfo().then(() => {
        // console.log(lambdaController.timeAndDuration);

        var functionArray = [];
        var tagsArray = [];
        var timeAndDur = [];

        var view = { 
            function: functionArray, 
            tagsArray: tagsArray, 
            timeAndDuration: timeAndDur,
            rawData : JSON.stringify(lambdaController.timeAndDuration),
        };

        function tableStats(idx, shortHandFunc, array) {
            var timeDuration = lambdaController.timeAndDuration[shortHandFunc].timeSeries;
            for (var i = 0 ; i < timeDuration.length; i++) {
                for (var date in timeDuration[i]) {
                    array[idx] += `<tr><td style = "font-weight: 400">${date}</td> <td style = "font-weight: 400">${precisionRound(timeDuration[i][date], 3)} mil</td> </tr>`;
                }
            }
            array[idx] += `</table></div>`;
        }

        lambdaController.functionList.Functions.forEach((func, idx) => {
            var shortHandFunc = func.FunctionName.split('-')[1]
            functionArray[idx] = `<button class="functions" ${shortHandFunc}"><b>Function Name</b>: ${shortHandFunc}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<b> Tag Groups</b>: `;
            for (var tagGroup in lambdaController.tagGroups) {
                if (lambdaController.tagGroups[tagGroup].includes(func.FunctionName)) {
                    functionArray[idx] += ` - ${tagGroup}`
                }
            }
            functionArray[idx] += `</button><div style=" display: none; overflow-y: auto; height: 300px;"> <table style = "width: 80%; text-align: center;"><tr style = ""><th style = "font-weight: bold">Since Previously Invoked</th><th style = "font-weight: bold">Duration</th></tr>`
            tableStats(idx, shortHandFunc, functionArray);
        });

        Object.keys(lambdaController.tagGroups).forEach((tag, idx) => {
            tagsArray[idx] = (`<button class="tags" id = "${tag}" ><b> Tag Groups</b>: ${tag} </button> <div style="display: none;">`);
            lambdaController.tagGroups[tag].forEach((functionName) => {
                var shortFunctionName = functionName.split('-')[1];
                tagsArray[idx] += `<button class = "tagFunction">${shortFunctionName}</button> <div style=" display: none; overflow-y: auto; height: 300px;"> <table style = "width: 80%; text-align: center;"><tr><th style = "font-weight: bold">Since Previously Invoked</th><th style = "font-weight: bold">Duration</th></tr>`;
                tableStats(idx, shortFunctionName, tagsArray);
            });
            tagsArray[idx] += `</div>`;
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

lambdaController.getHtmlViz = function (req, res) { res.send(this.htmlViz); }

function cloudWatchParams(funcName) {
    this.EndTime = new Date,
        this.MetricDataQueries = [
            {
                Id: 'testMetric',
                MetricStat: {
                    Metric: {
                        Dimensions: [{ Name: 'FunctionName', Value: funcName }],
                        MetricName: 'Duration',
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
        this.timeAndDuration[func.FunctionName.split('-')[1]] = { timeSeries: [], MemorySize: func.MemorySize, codeSize: func.CodeSize, runTimeEnv: func.Runtime, lastModified: func.LastModified };
        return new Promise((resolve) => {
            cloudwatch.getMetricData(new cloudWatchParams(func.FunctionName), (err, data) => {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    for (var i = data.MetricDataResults[0].Values.length - 1; i >= 0; i--) {
                        // var time = data.MetricDataResults[0].Timestamps[i + 1] ? new Date(data.MetricDataResults[0].Timestamps[i]).getTime() / 1000 - new Date(data.MetricDataResults[0].Timestamps[i + 1]).getTime() / 1000 : 0;
                        var funcName = func.FunctionName.split('-')[1];
                        var date = data.MetricDataResults[0].Timestamps[i];
                        var duration = data.MetricDataResults[0].Values[i];
                        var singleInvocationData = {[date] : duration};
                        this.timeAndDuration[funcName].timeSeries.push(singleInvocationData); // successful response
                    }
                    return resolve();
                }
            });
        })
    });

    return Promise.all(newFunctions)
        .then(() => { })
        .catch((error) => { console.error(`FAILED: error retrieving data, ${error}`) });
}

function pullParams(funcName) {
    this.FunctionName = funcName,
        this.InvocationType = 'RequestResponse',
        this.LogType = 'None',
        this.Payload = '{"source" : "C4-serverless"}'
};

lambdaController.setFunctionList = function (functionList) {
    this.functionList = functionList;
    functionList.Functions.forEach((func) => {
        this.allFunctions[func.FunctionName.split('-')[1]] = func.FunctionName;
    });
    renderTemplate();
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