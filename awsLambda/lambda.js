const aws = require('aws-sdk');

exports.handler1 = function(event, context, callback) {
    if (event.source === "C4-serverless") {
<<<<<<< HEAD
        for (var i = 0; i < 4000; i += 1){
            console.log('hi')
        }
        callback(null, 'In server')
=======
        function Hello(n) {
            if(n === 1 || n === 2) return 1;
            return Hello(n - 1) + Hello(n - 2);
        }
        callback(null, Hello(10));
>>>>>>> 2964aaa4334383ef4b81e0c25af17f685db8a73f
    } else {
        callback(null, "What the f***");
    }
}

exports.handler2 = function(event, context, callback) {
    if (event.source === "C4-serverless") {
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