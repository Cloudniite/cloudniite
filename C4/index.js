const AWS = require('aws-sdk');
var lambda;
const lambdaController = { functionList: "" };
const tagGroups = {};


//CloudWatch Module
var cloudwatch = new AWS.CloudWatch({ region: 'us-east-1', apiVersion: '2010-08-01' });


//LISTING METRICS HERE WORKING 
// var params = {
//     Dimensions: [
//       {
//         Name: 'FunctionName', /* required */
//         Value: 'testApp-TestFunction1-7SVG4CPT2W81'
//       },
//       /* more items */
//     ],
//     MetricName: 'Invocations',
//     Namespace: 'AWS/Lambda'
//   };
//   cloudwatch.listMetrics(params, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else     console.log(data);           // successful response
//   });

var params = {
    EndTime: new Date, /* required */
    MetricDataQueries: [ /* required */
      {
        Id: 'testMetric', /* required */
        MetricStat: {
          Metric: { /* required */
            Dimensions: [
              {
                Name: 'FunctionName', /* required */
                Value: 'testApp-TestFunction3-T5R31NF3BZ9F' /* required */
              },
              /* more items */
            ],
            MetricName: 'Duration',
            Namespace: 'AWS/Lambda'
          },
          Period: 30, /* required */
          Stat: 'Sum', /* required */
        },
        ReturnData: true || false
      },
      /* more items */
    ],
    StartTime: 0, /* required */
    MaxDatapoints: 10,
  };

  cloudwatch.getMetricData(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data.MetricDataResults[0]);           // successful response
  });


function pullParams(funcName) {
    this.FunctionName = funcName,
        this.InvocationType = 'RequestResponse',
        this.LogType = 'None',
        this.Payload = '{"source" : "C4-serverless"}'
};

lambdaController.configure = (region, IdentityPoolId, apiVersion = '2015-03-31') => {
    AWS.config.update({ region: region });
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: IdentityPoolId });
    lambda = new AWS.Lambda({ region: region, apiVersion: apiVersion });
}


lambdaController.setFunctionList = function (functionList) {
    this.functionList = functionList;
}

lambdaController.getAwsFunctions = function (...rest) {
    const awsFunctionNames = [];
    this.functionList.Functions.forEach(func => {
        if (rest.includes(func.FunctionName.split('-')[1])) awsFunctionNames.push(func.FunctionName);
    })
    return awsFunctionNames;
}

lambdaController.warmupFunctions = function (timer = null, ...rest) {
    if (typeof timer !== 'number' && timer !== null) return console.error(`FAILED at warmupFunctions: First argument should be a number specifying the timer or null for single execution`);
    var functions = this.getAwsFunctions(...rest);
    const createfunc = () => {
        var newFunctions = functions.map((func) => {
            return new Promise((resolve) => {
                lambda.invoke(new pullParams(func), (error, data) => {
                    if (error) {
                        throw error;
                    } else {
                        console.log(data);
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
    tagGroups[tagGroup] = this.getAwsFunctions(...rest);
};

lambdaController.warmupTagGroup = (timer = null, tagGroup) => {
    if (typeof timer !== 'number' && timer !== null) return console.error(`FAILED at warmupTagGroup: First argument should be a number specifying the timer or null for single execution`);
    if (typeof tagGroup !== 'string') return console.error('FAILED at warmupTagGroup: First argument should be a string specifying the category');
    if (!(tagGroup in tagGroups)) return console.error(`FAILED at warmupTagGroup: ${tagGroup} is invalid`);
    const functions = tagGroups[tagGroup];
    const createFunc = () => {
        var newFunctions = functions.map((func) => {
            return new Promise((resolve) => {
                lambda.invoke(new pullParams(func), (error, data) => {
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
            .then(() => console.log(`Warmup of category ${tagGroup} complete`))
            .catch((error) => { console.error(`FAILED: Warmup of category ${tagGroup} failed, ${error}`) });
    }

    promiseCall();
    if (timer !== null && timer > 0) setInterval(() => { promiseCall() }, (timer * 60000));
}

module.exports = lambdaController;