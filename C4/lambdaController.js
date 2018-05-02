const resources = require('./aws-stack-resources');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: 'us-east-1:77063b48-4177-4e13-a3d7-50657c0c503e' });
var lambda = new AWS.Lambda({ region: 'us-east-1', apiVersion: '2015-03-31' });

const lambdaController = {};
const tagGroups = {};

function pullParams(funcName) {
    this.FunctionName = funcName,
    this.InvocationType = 'RequestResponse',
    this.LogType = 'None',
    this.Payload = '{"source" : "C4-serverless"}'
};

lambdaController.createTagGroup = (tagGroup, ...rest) => {
    const functionsArr = [];
    resources.StackResourceSummaries.forEach(resource => {
        if (rest.includes(resource.LogicalResourceId)) {
            functionsArr.push(resource.PhysicalResourceId);
        }
    })

    tagGroups[tagGroup] = functionsArr;
};

lambdaController.warmupTagGroup = (tagGroup) => {
    const functions = tagGroups[tagGroup];
    
        var newFunctions = functions.map((func) => {
            console.log('Running this function: ', func);

           return new Promise((resolve) => {
            
            lambda.invoke(new pullParams(func), (error, data) => {
                if (error) {
                    console.log("ERROR: ", error);
                    resolve();
                } else {
                    console.log(`Invoked ${func}:`, data.Payload);
                    resolve();
                }
            });
           })
        });

       Promise.all(newFunctions).then(() => console.log('done'));
    }

lambdaController.pullParamsBuild = 


module.exports = lambdaController;