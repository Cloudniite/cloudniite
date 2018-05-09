const AWS = require('aws-sdk');
const Mustache = require('mustache');
var fs = require("fs");
const path = require('path');

const lambdaController = { functionList: "", tagGroups: {}, timeAndDuration: {}, htmlViz: "", lambda: "" };
var cloudwatch = new AWS.CloudWatch({ region: 'us-east-1', apiVersion: '2010-08-01' });

lambdaController.configure = function (region, IdentityPoolId, apiVersion = '2015-03-31') {
    AWS.config.update({ region: region });
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: IdentityPoolId });
    this.lambda = new AWS.Lambda({ region: region, apiVersion: apiVersion });
}

function renderTemplate(env = "production") {
    if (env === "production") return;
    lambdaController.getAllFuncInfo().then(() => {

        var arr = [];
        var tagsOnly = [];
        var tagsWFunc = [];
        var timeAndDur = [];

        lambdaController.functionList.Functions.forEach((func) => {
            var shortHandFunc = func.FunctionName.split('-')[1]
            arr.push(`<button class="functions ${shortHandFunc}">${shortHandFunc} </button>`);
            var timeDurObj = lambdaController.timeAndDuration[shortHandFunc].timeAndDuration;
            for (var key in timeDurObj) {
                timeAndDur.push(`<p class="timeAndDur ${shortHandFunc}"> ${key.split(": ")[1]} with a ${precisionRound(timeDurObj[key], 3)} milliseconds delay </p>`)
            };
        });

        Object.keys(lambdaController.tagGroups).forEach((tag) => {
            tagsOnly.push(`<button class="tag ${tag}">${tag} </button>`);
        })

        var view = {
            function: arr,
            runEnv: '',
            tagsOnly: tagsOnly,
            tagsWFunc: tagsWFunc,
            timeAndDuration: timeAndDur,
        };

        fs.readFile(path.join(__dirname, 'index.mustache'), 'utf-8', function (err, html) {
            if (err) throw err;
            var output = Mustache.to_html(html, view);
            this.htmlViz = output;
        });
    }).catch((error) => { console.error(`FAILED: add to html failed, ${error}`) });
}

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

lambdaController.getHtmlViz = function (req, res) {
    res.send(this.htmlViz);
}

function cloudWatchParams(funcName) {
    this.EndTime = new Date, /* required */
        this.MetricDataQueries = [ /* required */
            {
                Id: 'testMetric', /* required */
                MetricStat: {
                    Metric: { /* required */
                        Dimensions: [
                            {
                                Name: 'FunctionName', /* required */
                                Value: funcName, /* required */
                            },
                            /* more items */
                        ],
                        MetricName: 'Duration',
                        Namespace: 'AWS/Lambda'
                    },
                    Period: 60, /* required */
                    Stat: 'Average', /* required */
                },
                ReturnData: true || false
            }
            /* more items */
        ];
    this.StartTime = 0 /* required */
}

lambdaController.getAllFuncInfo = function (req, res) {
    var newFunctions = this.functionList.Functions.map(func => {
        this.timeAndDuration[func.FunctionName.split('-')[1]] = { timeAndDuration: {}, MemorySize: func.MemorySize, codeSize: func.CodeSize, runTimeEnv: func.Runtime, lastModified: func.LastModified };
        return new Promise((resolve) => {
            cloudwatch.getMetricData(new cloudWatchParams(func.FunctionName), (err, data) => {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    for (var i = data.MetricDataResults[0].Values.length - 1; i >= 0; i--) {
                        var time = data.MetricDataResults[0].Timestamps[i + 1] ? new Date(data.MetricDataResults[0].Timestamps[i]).getTime() / 1000 - new Date(data.MetricDataResults[0].Timestamps[i + 1]).getTime() / 1000 : 0;
                        this.timeAndDuration[func.FunctionName.split('-')[1]].timeAndDuration[`${data.MetricDataResults[0].Timestamps.length - 1 - i} : ${Math.abs(time) / 60} minutes since last invocation`] = data.MetricDataResults[0].Values[i]; // successful response
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

lambdaController.setFunctionList = function (functionList, env) {
    this.functionList = functionList;
    renderTemplate(env);
}

lambdaController.getAwsFunctions = function (...rest) {
    const awsFunctionNames = [];
    this.functionList.Functions.forEach(func => {
        if (rest.includes(func.FunctionName.split('-')[1])) awsFunctionNames.push(func.FunctionName);
    })
    return awsFunctionNames;
}

lambdaController.warmupFunctions = function (timer, ...rest) {
    if (typeof timer !== 'number' && timer !== null) return console.error(`FAILED at warmupFunctions: First argument should be a number specifying the timer or null for single execution`);
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
    if (typeof tagGroup !== 'string') return console.error('FAILED at createTagGroup: First argument should be a string specifying the category');
    this.tagGroups[tagGroup] = this.getAwsFunctions(...rest);
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