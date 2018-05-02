const lambdaController = {};
const resources = require('./aws-stack-resources');
const tagGroups = {};

lambdaController.createTagGroup = (tagGroup, ...rest)  => {
    tagGroups[tagGroup] = rest;
};

lambdaController.warmupTagGroup = (tagGroup) => {
    const functions = tagGroups[tagGroup];
}

module.exports = lambdaController;