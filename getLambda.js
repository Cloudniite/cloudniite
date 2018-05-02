const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: 'us-east-1:77063b48-4177-4e13-a3d7-50657c0c503e' });

var lambda = new AWS.Lambda({ region: 'us-east-1', apiVersion: '2015-03-31' });

var pullParams = {
    FunctionName: '',
    InvocationType: 'RequestResponse',
    LogType: 'None',
};

var pullResults;

var lambdaController = {};

lambdaController.warmUp = function (req, res, next) {
    // lambda.GET /2015-03-31/functions/?FunctionVersion=FunctionVersion&Marker=Marker&MasterRegion=MasterRegion&MaxItems=MaxItems HTTP/1.1
    // res.end();
};

lambdaController.getLambda1 = function (req, res, next) {
    pullParams.FunctionName = "testApp-TestFunction1-R8GNHDBI3CM1"
    lambda.invoke(pullParams, (error, data) => {
        if (error) {
            console.log("ERROR: ", error);
        } else {
            res.send(data);
        }
    });
};

lambdaController.getLambda2 = function (req, res, next) {
    pullParams.FunctionName = "testApp-TestFunction2-127Y0CYGDRE0M"
    lambda.invoke(pullParams, (error, data) => {
        if (error) {
            console.log("ERROR: ", error);
        } else {
            res.send(data.Payload);
        }
    });
};

lambdaController.getLambda3 = function (req, res, next) {
    pullParams.FunctionName = "testApp-TestFunction3-1JKJE2X6GODGK"
    lambda.invoke(pullParams, (error, data) => {
        if (error) {
            console.log("ERROR: ", error);
        } else {
            res.send(data.Payload);
        }
    });
};

module.exports = lambdaController;