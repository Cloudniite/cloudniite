const express = require('express');
const path = require('path');
const body = require('body-parser');
const cloudniite = require('../../Library/index.js');
const app = express();

cloudniite.configure('us-east-1','us-east-1:77063b48-4177-4e13-a3d7-50657c0c503e').then(() => {

    // cloudniite.warmupTagGroup(null, "#HelloWorld");
    // cloudniite.warmupFunctions(0.1, "TestFunction4");
});


//This is a custom route for specifically for development 
//Go to this route to view all your tag groups and AWS Lambda function informations
app.get('/getHtmlViz', cloudniite.getHtmlViz);

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
    cloudniite.warmupTagGroup(null, "#HelloWorld");
    res.sendFile(path.join(__dirname, './loginSignupPages/signupPage.html'));
});

app.get('/login', (req, res) => {
    // cloudniite.warmupTagGroup(null, "#HelloWorld");
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