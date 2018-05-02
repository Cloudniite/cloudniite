const aws = require('aws-sdk');

exports.handler1 = function(event, context, callback) {
    callback(null, "Hello");
}

exports.handler2 = function(event, context, callback) {
    console.log('remaining time =', context.getRemainingTimeInMillis());
    callback(null, Date.now());
}

exports.handler3 = function(event, context, callback) {
    console.log('remaining time =', context.getRemainingTimeInMillis());
    callback(null, Date.now());
}