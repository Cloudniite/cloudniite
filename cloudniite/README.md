# [Cloudniite](https://cloudniite.com)&middot;[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Cloudniite/cloudniite/blob/master/LICENSE) [![Twitter URL](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/cloudniite)



Cloudniite is a JavaScript library that helps you as a developer optimize and monitor your serverless application performance and metrics on AWS Lambda. We chose AWS because it has an exceptional ecosystem of cloud products and a huge community of developers that are passionate about the future of serverless. We integrate seamlessly with your application to help you ensure your customers are having a fast and responsive experience. We do this by helping you organize and monitor event-driven AWS Lambda functions. If you are unfamiliar with AWS Lambda, no need to worry, we will cover the core concepts in the next section.

![demo gif](https://github.com/Cloudniite/cloudniite/raw/master/demo.gif)

[Learn how to use Cloudniite in your own project](https://cloudniite.com/documentation/introduction).

## How do you optimize AWS Lambda functions?
Amazon has to prepare or spin-up, new virtual servers to run your code. This startup time only happens when your functions haven't been run in a while. For Amazon, it doesn't make sense to keep your function running on a server if no one is using it. So, after a period of time, if your function isn't used, Amazon will "destroy" the server it is living on. This function will now be considered "cold". Cold functions take longer to run and will leave your users waiting longer for a response because of the time it takes to spin up a server to host the function.

Developers have been using simple timers to "warmup" their functions so that they stay running and available for users. This solution works but we believed there could be a smarter way to manage and keep your Lambda functions warm and performant.

# Installation

Cloudniite is available as the cloudniite package on npm.

```jsx
npm install --save cloudniite
```

# Getting Started

## Creating a function
To minimize execution duration and cost, add an **if statement** to check if Cloudniite has invoked the funtion.
This will warm-up the funtion without running the function logic

Two options for creating a function:
- [ ] Manually in your text editor
- [ ] Inside AWS Lamda function creator


#### Option 1: Manually in your text editor
- [X] Text editor
- [ ] AWS Lamda function creator

##### Yaml file *optional:

Recommended to add ``` FunctionName: func ``` at the bottom of the function in the yaml to create a custom name. 

* Otherwise, AWS CloudFormation generates a unique physical ID to name a resource.
* this ID is the name of your function in AWS.
* to refer to the function in our library you **MUST** use the function name in AWS.

* exception: If you reuse templates to create multiple stacks, you must change or remove custom names from your template. 

###### example:
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Resources:
  func:
    Type: AWS::Serverless::Function
    Properties:
      Handler: lambda.handler
      Runtime: nodejs8.10
      Environment: 
        Variables:
          S3_BUCKET: bucketName
      FunctionName: func 
```

##### Lambda file:

``` jsx
exports.handler = function(event, context, callback) {
    if (event.source === "Cloudniite-Warmup") {
        callback(null,"Warmup");
    } else {
         ....add lambda logic here
    }
}
```
Make sure both yaml and lambda files are in the same folder.


### Option 2: Inside AWS Lamda function creator
- [ ] Text editor
- [X] AWS Lamda function creator

<img src="https://github.com/Cloudniite/cloudniite/raw/master/awsCloudniite.png" width="600" />

# Setting up your server

``` jsx
const express = require('express');
const cloudniite = require('cloudniite');
```
##### configure(region,poolId, apiVersion = optional):
*default apiVersion is 2015.
*Advice: if there is a config error, verify that the internet is working.

Configure returns a promise.
If you wish to warm up on server start, use the .then method to invoke the other methods.

``` jsx
cloudniite.configure('region','poolId').then(() => {
//add methods here
});
```

## Methods

Cloudniite lets you easily group your Lambda functions however you like. If you want to make sure all the Lambda functions associated with your landing page are warmed up, simply create a tag group passing in the functions you would like to be grouped together.

##### createTagGroup(tagGroup, functionName):
* add as many functions as you want
  * if you want to add an array rather then individual functions, add a spread operator
``` cloudniite.createTagGroup(#tagName, … [functionName1, functionName2, functionName3]) ```
* must be a string

```jsx
cloudniite.createTagGroup("#tagGroup", "function1", "function2")
```
Then, whenever you want to warmup the LandingPage functions, just call our method passing in the tag group name.

##### warmupTagGroup(interval, tagGroup):
To warm up your function on a recurring timer, add an interval
* intervals are set in minutes
* **null:** no interval

```jsx
cloudniite.warmupTagGroup(null,"#tagGroup"); 
```

You can also warm up individuals functions

##### warmupFunctions(interval, tagGroup):
* intervals are set in minutes
* **null:** no interval

```jsx
cloudniite.warmupFunctions(null,"functionName");; 
```
##### Recomended:
Create a tag group for all the lambda functions on a route and call the warmupTagGroup method as middleware!

### Visualizer

Here you can see:
* List of all Tag Groups and the functions associated
* List of all your functions
* Graphs to help you decide when to use intervals for each function or tag group
* and more...

To access the visualizer add a custom route to your server.
``` jsx
app.get('/getHtmlViz', cloudniite.getHtmlViz);
```

Go to the route on your port
* URL format: port/getHtmlViz
###### example: ``` http://localhost:3000/getHtmlViz ```

## Authors

* **Linda Harrison** - *Initial work* - [GitHub](https://github.com/LindafHarrison)
* **Stephen Grable** - *Initial work* - [GitHub](https://github.com/StephenGrable1)
* **Muhammad Sheikh** - *Initial work* - [GitHub](https://github.com/msheikh93)

### License

Cloudniite is [MIT licensed](./LICENSE).
