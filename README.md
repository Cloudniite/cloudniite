# [Cloudniite](https://cloudniite.com)&middot;[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE) [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/react)

Cloudniite is a JavaScript library that helps you as a developer optimize and monitor your serverless application performance and metrics on AWS Lambda. We chose AWS because it has an exceptional ecosystem of cloud products and a huge community of developers that are passionate about the future of serverless. We integrate seamlessly with your application to help you ensure your customers are having a fast and responsive experience. We do this by helping you organize and monitor event-driven AWS Lambda functions. If you are unfamiliar with AWS Lambda, no need to worry, we will cover the core concepts in the next section.

[Learn how to use Cloudniite in your own project](https://cloudniite.com/documentation/introduction).

## How do you optimize AWS Lambda functions?
Amazon has to prepare or spin-up, new virtual servers to run your code. This startup time only happens when your functions haven't been run in a while. For Amazon, it doesn't make sense to keep your function running on a server if no one is using it. So, after a period of time, if your function isn't used, Amazon will "destroy" the server it is living on. This function will now be considered "cold". Cold functions take longer to run and will leave your users waiting longer for a response because of the time it takes to spin up a server to host the function.

Developers have been using simple timers to "warmup" their functions so that they stay running and available for users. This solution works but we believed there could be a smarter way to manage and keep your Lambda functions warm and performant.

## Cloudniite Examples.
Below are a few examples of how you could use our library to minimize cold starts, organize your functions into groups and optimize your application to ensure it responds quickly to user actions.

## AWS Lambda Function Groups
Cloudniite lets you easily group your Lambda functions however you like. If you want to make sure all the Lambda functions associated with your landing page are warmed up, simply create a tag group passing in the functions you would like to be grouped together.

```jsx
cloudniite.createTagGroup("#LandingPage","SignupUser","EmailSubscription")
```

Then, whenever you want to warmup the LandingPage functions, just call our method passing in the tag group name.

```jsx
lambdaController.warmupTagGroup(null, "#LandingPage"); 
```

## Installation

Cloudniite is available as the cloudniite package on npm.

```jsx
npm install --save cloudniite
```

## Authors

* **Linda Harrison** - *Initial work* - [GitHub](https://github.com/LindafHarrison)
* **Stephen Grable** - *Initial work* - [GitHub](https://github.com/StephenGrable1)
* **Muhammad Sheikh** - *Initial work* - [GitHub](https://github.com/msheikh93)

### License

Cloudniite is [MIT licensed](./LICENSE).
