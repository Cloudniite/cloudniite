const express = require('express');
const path = require('path');
const body = require('body-parser');
const functionList = require('./awsLambda/listFunction.json');
const lambdaController = require('./C4/index.js');
const app = express();

lambdaController.configure('us-east-1','us-east-1:77063b48-4177-4e13-a3d7-50657c0c503e');
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

<<<<<<< HEAD
lambdaController.createTagGroup("#HelloWorld", "TestFunction1", "TestFunction2");
// lambdaController.createTagGroup("#HelloWorld1", "TestFunction3");
lambdaController.warmupFunctions(null,"TestFunction1");
// lambdaController.warmupTagGroup(3, "#HelloWorld");
=======
// lambdaController.createTagGroup("#HelloWorld", "TestFunction1", "TestFunction2");
// lambdaController.createTagGroup("#HelloWorld1", "TestFunction3");
// lambdaController.warmupFunctions(0.1,"TestFunction4");
// lambdaController.warmupTagGroup(0.1, "#HelloWorld1");
lambdaController.getAllFuncInfo();
>>>>>>> 2964aaa4334383ef4b81e0c25af17f685db8a73f

app.listen(3000, () => {
    console.log("Listening on PORT");
});