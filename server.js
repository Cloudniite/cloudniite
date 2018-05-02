const express = require('express');
const path = require('path');
const body = require('body-parser');
const lambda = require('./getLambda.js');
const lambdaController = require('./C4/lambdaController.js');

const app = express();

app.get('/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.js'));
});

app.get('/secondPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'secondPage.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

lambdaController.createTagGroup("#HelloWorld", "TestFunction1", "TestFunction2");
lambdaController.createTagGroup("#HelloWorld1", "TestFunction3");
lambdaController.warmupTagGroup("#HelloWorld");

app.get('/warmUp', lambda.warmUp);
app.get('/getLambda1', lambda.getLambda1);
app.get('/getLambda2', lambda.getLambda2);
app.get('/getLambda3', lambda.getLambda3);

app.listen(3000, () => {
    console.log("Listening on PORT");
});