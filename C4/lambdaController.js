const resources = require('./aws-stack-resources');
const AWS = require('aws-sdk');

var lambda;

const lambdaController = {};
const tagGroups = {};

function pullParams(funcName) {
    this.FunctionName = funcName,
    this.InvocationType = 'RequestResponse',
    this.LogType = 'None',
    this.Payload = '{"source" : "C4-serverless"}'
};

lambdaController.configure = (IdentityPoolId, apiVersion = '2015-03-31') => {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: IdentityPoolId });
    lambda = new AWS.Lambda({ apiVersion: apiVersion });
}

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