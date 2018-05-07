const express = require('express');
const path = require('path');
const body = require('body-parser');
const lambdaController = require('./functionInfo.js');
const app = express();

console.log("In our viz server: ", lambdaController);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(4000, () => {
    console.log("Listening on PORT");
});