const expect = require('expect');
const lambdaController = require('./../index.js');

describe('Lamba Controller Tests', () => {
    it('Check if controller has property', () => {
        expect(lambdaController.hasOwnProperty('functionList')).toEqual(true);
        expect(lambdaController.hasOwnProperty('tagGroups')).toEqual(true);
        expect(lambdaController.hasOwnProperty('timeAndDuration')).toEqual(true);
        expect(lambdaController.hasOwnProperty('htmlViz')).toEqual(true);
    });
});

describe('getAllFuncInfo test/s', () => {
    it('Check if type of property is a function', () => {
        expect(typeof lambdaController.getAllFuncInfo).toEqual('function');
    });
});

describe('configure test/s', () => {
    it('Check if type of property is a function', () => {
        expect(typeof lambdaController.configure).toEqual('function');
    });
});

describe('warmupFunctions test/s', () => {
    it('Check if type of property is a function', () => {
        expect(typeof lambdaController.warmupFunctions).toEqual('function');
    });
});

describe('warmupTagGroup test/s', () => {
    it('Check if type of property is a function', () => {
        expect(typeof lambdaController.warmupTagGroup).toEqual('function');
    });
});


describe("getAwsFunctions test/s", () => {

    before(() => {
        lambdaController.functionList = { Functions: [{ FunctionName: 'testApp-TestFunction4-1LPS6WA57I0WJ' }, { FunctionName: 'testApp-TestFunction5-6H67G6EFI5PK' }, { FunctionName: 'testApp-TestFunction6-D72ZQPHTWE3W' }] };
    });

    it('Check if type of property is a function', () => {
        expect(typeof lambdaController.getAwsFunctions).toEqual('function');
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

    it('Check if type of property is a function', () => {
        expect(typeof lambdaController.setFunctionList).toEqual('function');
    });

    it('Check if function list has property', () => {
        expect(lambdaController.functionList.hasOwnProperty("Functions")).toEqual(true);
    });

    it('Check if functionList has function name', () => {
        expect(lambdaController.functionList.Functions[1].FunctionName).toEqual('testApp-TestFunction5-6H67G6EFI5PK');
    });

});


describe("createTagGroup test/s", () => {
    before(() => {
        lambdaController.setFunctionList({ Functions: [{ FunctionName: 'testApp-TestFunction4-1LPS6WA57I0WJ' }, { FunctionName: 'testApp-TestFunction5-6H67G6EFI5PK' }, { FunctionName: 'testApp-TestFunction6-D72ZQPHTWE3W' }] });
        lambdaController.createTagGroup("#HelloWorld1", "TestFunction6");
    });

    it('Check if type of property is a function', () => {
        expect(typeof lambdaController.createTagGroup).toEqual('function');
    });

    it('Check if tagGroups has property', () => {
        expect(lambdaController.tagGroups.hasOwnProperty("#HelloWorld1")).toEqual(true);
    });

    it('Check if a Tag Group has an Array as a value', () => {
        expect(Array.isArray(lambdaController.tagGroups['#HelloWorld1'])).toEqual(true);
    });

    it("Check if a Tag Group's value contains the correct function name", () => {
        expect(lambdaController.tagGroups['#HelloWorld1'][0]).toEqual('testApp-TestFunction6-D72ZQPHTWE3W');
    });

});