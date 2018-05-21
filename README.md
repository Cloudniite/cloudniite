Tutorial Page
Setting Up A New Project
1. Follow the AWS step by step tutorial on configuring AWS Cli (you might need to install AWS Cli):
https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-quick-configuration
2. Setup Node package modules:
npm init
For step by step instructions on setting up your Node package modules (https://www.sitepoint.com/beginners-guide-node-package-manager)
3. Install the following Node dependies:
npm install --save aws-sdk cloudniite express
4. Create an S3 bucket with the following cli command, which will create a 'my-bucket' named bucket in AWS S3:
aws s3api create-bucket --bucket my-bucket --region region
Set your bucket name to your name preference, and your region to the correct region (regions are located on the AWS Interface)
5. Create your yaml and lambda files(Our case test.yaml and lambda.js):
test.yaml
AWSTemplateFormatVersion: '2010-09-09'
    Transform: AWS::Serverless-2016-10-31
    Resources:
    TestFunction4:
        Type: AWS::Serverless::Function
        Properties:
            Handler: lambda.handleName
            Runtime: nodejs8.10
            Environment: 
                Variables:
                    S3_BUCKET: bucketName
lambda.js
const aws = require('aws-sdk');

exports.handler1 = function(event, context, callback) {
    if (event.source === "Cloudniite-Warmup") {
        callback(null,"Warmup");
    } else {
        callback(null, "Lambda function return value");
    }
}
Make sure both the files are in the same folder
6. Package and deploy your Lambda files to a stack:
aws cloudformation package --template-file fileName.yaml --output-template-file serverless-output.yaml --s3-bucket my-bucket
aws cloudformation deploy --template-file serverless-output.yaml --stack-name stackName --capabilities CAPABILITY_IAM




# cloudniite
# Project Title

One Paragraph of project description goes here

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

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

