const aws = require('aws-sdk');


const iopipeLib = require('@iopipe/core');

var iopipe = require('@iopipe/iopipe')({
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNTk0ZDQ5My00NDBlLTQ2MDktODViZi1jYmFjNDIyYjQyN2MiLCJqdGkiOiIwY2Q1ZDdkYS0yYWFkLTRiZjgtYWVjNi1kM2I3YzE4OGIyYWEiLCJpYXQiOjE1MjU5OTE4NzMsImlzcyI6Imh0dHBzOi8vaW9waXBlLmNvbSIsImF1ZCI6Imh0dHBzOi8vaW9waXBlLmNvbSxodHRwczovL21ldHJpY3MtYXBpLmlvcGlwZS5jb20vZXZlbnQvLGh0dHBzOi8vZ3JhcGhxbC5pb3BpcGUuY29tIn0.GP8BzZOgXZbDQwnV4Mr7TMPFZsNJsocDr5m0cE_2ePE'
  });

exports.handler1 = iopipe(function(event, context, callback) {
    if (event.source === "Cloudniite-Warmup") {
        function Hello(n) {
            if(n === 1 || n === 2) return 1;
            return Hello(n - 1) + Hello(n - 2);
        }
        callback(null, Hello(10));
    } else {
        callback(null, "What the f***");
    }
})

exports.handler2 = iopipe(function(event, context, callback) {
    if (event.source === "Cloudniite-Warmup") {
        function Hello(n) {
            if(n === 1 || n === 2) return 1;
            return Hello(n - 1) + Hello(n - 2);
        }
        callback(null, Hello(10));
    } else {
        callback(null, "What the f***");
    }
})

exports.handler3 = iopipe(function(event, context, callback) {
    console.log('remaining time =', context.getRemainingTimeInMillis());
    callback(null, Date.now());
})