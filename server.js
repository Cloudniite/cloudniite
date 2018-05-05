const express = require('express');
const path = require('path');
const body = require('body-parser');
const lambdaController = require('./C4/index.js');
const functionList = require('./awsLambda/listFunction.json');
const app = express();

lambdaController.configure('us-east-1','us-east-1:c7bc97de-e707-41b9-aa4a-b12ee24e5817');
lambdaController.setFunctionList(functionList);

app.get('/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.js'));
});

app.get('/secondPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'secondPage.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

<<<<<<< HEAD
// lambdaController.createTagGroup("#HelloWorld", "TestFunction1", "TestFunction2");
// lambdaController.createTagGroup("#HelloWorld1", "TestFunction3");
// lambdaController.warmupFunctions(0.1,"TestFunction4");
// lambdaController.warmupTagGroup(0.1, "#HelloWorld1");
=======
lambdaController.createTagGroup("#HelloWorld", "TestFunction1", "TestFunction2");
lambdaController.createTagGroup("#HelloWorld1", "TestFunction3");
lambdaController.warmupFunctions(3,"TestFunction2");
lambdaController.warmupTagGroup(3, "#HelloWorld1");
>>>>>>> 0007fba22845acc4769d9c1c68a2e0791dc27dc3

app.listen(3000, () => {
    console.log("Listening on PORT");
});