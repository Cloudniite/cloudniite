const aws = require('aws-sdk');

exports.handler1 = function(event, context, callback) {
    if (event.source === "C4-serverless") {
        for (var i = 0; i < 4000; i += 1){
            console.log('hi')
        }
        callback(null, 'In server')
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