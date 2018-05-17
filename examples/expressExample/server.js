const express = require('express');
const path = require('path');
const body = require('body-parser');
const lambdaController = require('../../C4/index.js');
const app = express();

lambdaController.configure('us-east-1','us-east-1:77063b48-4177-4e13-a3d7-50657c0c503e').then(() => {
    lambdaController.createTagGroup("#HelloWorld", "TestFunction6");
    // lambdaController.warmupTagGroup(null, "#HelloWorld");
});


//This is a custom route for specifically for development 
//Go to this route to view all your tag groups and AWS Lambda function information
app.get('/getHtmlViz', lambdaController.getHtmlViz);

//Landing page routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.js'));
});

app.get('/index.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.css'));
});


//Signup and Login Page Routes
app.get('/signup', (req, res) => {
    //Here you can warm up functions that are likely to be invoked when a user goes to this page
    lambdaController.warmupTagGroup(null, "#HelloWorld");
    res.sendFile(path.join(__dirname, './loginSignupPages/signupPage.html'));
});

app.get('/login', (req, res) => {
    // lambdaController.warmupTagGroup(null, "#HelloWorld");
    res.sendFile(path.join(__dirname, './loginSignupPages/loginPage.html'));
});

//Media fetching routes
app.get('/appMedia/guitar-stock.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, './appMedia//guitar-stock.jpg'));
});


app.get('/loginSignup.css', (req, res) => {
    res.sendFile(path.join(__dirname, './loginSignupPages/loginSignup.css'));
});



app.listen(3000, () => {
    console.log("Listening on PORT");
});