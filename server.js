const express = require('express');
const path = require('path');
const body = require('body-parser');
const lambdaController = require('./C4/index.js');
const functionList = require('./awsLambda/listFunction.json');
const app = express();

lambdaController.configure('us-east-1','us-east-1:c7bc97de-e707-41b9-aa4a-b12ee24e5817');
lambdaController.setFunctionList(functionList);
app.get('/getHtmlViz', lambdaController.getHtmlViz);


console.log('Fucntion List: ', lambdaController.getHtmlViz)



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
// lambdaController.createTagGroup("#HelloWorld1", "TestFunction3");
lambdaController.warmupFunctions(null,"TestFunction1");
// lambdaController.warmupTagGroup(3, "#HelloWorld");

app.listen(3000, () => {
    console.log("Listening on PORT");
});