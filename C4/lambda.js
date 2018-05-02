const aws = require('aws-sdk');

exports.handler1 = function(event, context, callback) {
    if (event.source === "C4-serverless") {
        callback(null, "In serverless");
    } else {
        callback(null, "What the f***");
    }
}

exports.handler2 = function(event, context, callback) {
    console.log('remaining time =', context.getRemainingTimeInMillis());
    callback(null, "What the f***2");
}

exports.handler3 = function(event, context, callback) {
    console.log('remaining time =', context.getRemainingTimeInMillis());
    callback(null, Date.now());
}