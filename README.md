# [Cloudniite](https://cloudniite.com)&middot;[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/C4-Serverless/cloudniite/LICENSE) [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/react)

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

### Setting Up A New Project

What things you need to install the software and how to install them

```
Give examples
```

### Installing

A step by step series of examples that tell you have to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc

