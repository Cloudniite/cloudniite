const aws = require('aws-sdk');

exports.handler1 = function(event, context, callback) {
    if (event.source === "Cloudniite-Warmup") {
        function Hello(n) {
            if(n === 1 || n === 2) return 1;
            return Hello(n - 1) + Hello(n - 2);
        }
        callback(null, Hello(10));
    } else {
        callback(null, "What the f***");
    }
}

exports.handler2 = function(event, context, callback) {
    if (event.source === "Cloudniite-Warmup") {
        function Hello(n) {
            if(n === 1 || n === 2) return 1;
            return Hello(n - 1) + Hello(n - 2);
        }
        callback(null, Hello(10));
    } else {
        callback(null, "What the f***");
    }
}

exports.handler3 = function(event, context, callback) {
    console.log('remaining time =', context.getRemainingTimeInMillis());
    callback(null, Date.now());
}