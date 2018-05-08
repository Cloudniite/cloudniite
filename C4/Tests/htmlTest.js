const expect = require('expect');
const lambdaController = require('./../index.js');

describe('Lamba Controller Tests', () => {
    it('Check if type of property is a function', () => {
        expect(typeof lambdaController.getAllFuncInfo).toEqual('function');
        expect(typeof lambdaController.configure).toEqual('function');
        expect(typeof lambdaController.setFunctionList).toEqual('function');
        expect(typeof lambdaController.getAwsFunctions).toEqual('function');
        expect(typeof lambdaController.warmupFunctions).toEqual('function');
        expect(typeof lambdaController.createTagGroup).toEqual('function');
        expect(typeof lambdaController.warmupTagGroup).toEqual('function');
    });

    it('Check if function has property', () => {
        expect(lambdaController.hasOwnProperty('functionList')).toEqual(true);
        expect(lambdaController.hasOwnProperty('tagGroups')).toEqual(true);
        expect(lambdaController.hasOwnProperty('timeAndDuration')).toEqual(true);
        expect(lambdaController.hasOwnProperty('htmlViz')).toEqual(true);
    });

    it('Check if typeOf return value of getAWsFunctions is an array', () => {
        expect(lambdaController.hasOwnProperty('functionList')).toEqual(true);
        expect(lambdaController.hasOwnProperty('tagGroups')).toEqual(true);
        expect(lambdaController.hasOwnProperty('timeAndDuration')).toEqual(true);
        expect(lambdaController.hasOwnProperty('htmlViz')).toEqual(true);
    });
});

describe("getAwsFunctions test/s", () => {
    before(() => {
        lambdaController.functionList = { Functions: [{ FunctionName: 'testApp-TestFunction4-1LPS6WA57I0WJ' }, { FunctionName: 'testApp-TestFunction5-6H67G6EFI5PK' }, { FunctionName: 'testApp-TestFunction6-D72ZQPHTWE3W' }] };
    });

    it('Check if typeOf return value of getAWsFunctions is an array', () => {
        expect(Array.isArray(lambdaController.getAwsFunctions(''))).toEqual(true);
    });

    it('Check if return value matches the AWS function name', () => {
        expect(lambdaController.getAwsFunctions('TestFunction4')[0]).toEqual("testApp-TestFunction4-1LPS6WA57I0WJ");
    });
});

describe("setFunctionList test/s", () => {
    before(() => {
        lambdaController.setFunctionList({ Functions: [{ FunctionName: 'testApp-TestFunction4-1LPS6WA57I0WJ' }, { FunctionName: 'testApp-TestFunction5-6H67G6EFI5PK' }, { FunctionName: 'testApp-TestFunction6-D72ZQPHTWE3W' }] });
    });

    it('Check if list has property', () => {
        expect(lambdaController.functionList.hasOwnProperty("Functions")).toEqual(true);
    });

    it('Check if functionList has function name', () => {
        expect(lambdaController.functionList.Functions[1].FunctionName).toEqual('testApp-TestFunction5-6H67G6EFI5PK');
    });
});