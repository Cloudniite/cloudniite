const expect = require('expect');
const lambdaController = require('./../index.js');

describe('Lamba Controller Tests', () => {

    it('Should have property of functionList', () => {
        expect(lambdaController.hasOwnProperty('functionList')).toEqual(true);
    });

    it('Should have property of tagGroups', () => {
        expect(lambdaController.hasOwnProperty('tagGroups')).toEqual(true);
    });

    it('Should have property of timeAndDuration', () => {
        expect(lambdaController.hasOwnProperty('timeAndDuration')).toEqual(true);
    });

    it('Should have property of htmlViz', () => {
        expect(lambdaController.hasOwnProperty('htmlViz')).toEqual(true);
    });
});

describe('getAllFuncInfo test/s', () => {
    it('Should be a function', () => {
        expect(typeof lambdaController.getAllFuncInfo).toEqual('function');
    });
});

describe('configure test/s', () => {
    it('Should be a function', () => {
        expect(typeof lambdaController.configure).toEqual('function');
    });
});

describe('warmupFunctions test/s', () => {
    it('Should be a function', () => {
        expect(typeof lambdaController.warmupFunctions).toEqual('function');
    });

    it('Should console log error and not return an array if first argument is not a number', () => {
        expect(Array.isArray(lambdaController.warmupFunctions('func_Name_Not_Suppose_To_Be_Here', 'functionName2'))).toEqual(false);
    });

});

describe('warmupTagGroup test/s', () => {
    
    before(() => {
        lambdaController.setFunctionList({ Functions: [{ FunctionName: 'testApp-TestFunction4-1LPS6WA57I0WJ' }, { FunctionName: 'testApp-TestFunction5-6H67G6EFI5PK' }, { FunctionName: 'testApp-TestFunction6-D72ZQPHTWE3W' }] });
        lambdaController.createTagGroup("#HelloWorld1", "TestFunction6");
    });
    
    it('Should be a function', () => {
        expect(typeof lambdaController.warmupTagGroup).toEqual('function');
    });

    it('Should console log error and not return an array if first argument is something other than a number', () => {
        expect(Array.isArray(lambdaController.warmupFunctions('func_Name_Not_Suppose_To_Be_Here', 'functionName2'))).toEqual(false);
    });

    it(`Should console log error and not return an array if tag group doesn't exist`, () => {
        expect(Array.isArray(lambdaController.warmupFunctions('#Non_existent_tag_group'))).toEqual(false);
    });
});


describe("getAwsFunctions test/s", () => {

    before(() => {
        lambdaController.functionList = { Functions: [{ FunctionName: 'testApp-TestFunction4-1LPS6WA57I0WJ' }, { FunctionName: 'testApp-TestFunction5-6H67G6EFI5PK' }, { FunctionName: 'testApp-TestFunction6-D72ZQPHTWE3W' }] };
    });

    it('Should be a function', () => {
        expect(typeof lambdaController.getAwsFunctions).toEqual('function');
    });

    it('Should return an array', () => {
        expect(Array.isArray(lambdaController.getAwsFunctions(''))).toEqual(true);
    });

    it('Should return a value that matches the AWS function name', () => {
        expect(lambdaController.getAwsFunctions('TestFunction4')[0]).toEqual("testApp-TestFunction4-1LPS6WA57I0WJ");
    });

});

describe("setFunctionList test/s", () => {

    before(() => {
        lambdaController.setFunctionList({ Functions: [{ FunctionName: 'testApp-TestFunction4-1LPS6WA57I0WJ' }, { FunctionName: 'testApp-TestFunction5-6H67G6EFI5PK' }, { FunctionName: 'testApp-TestFunction6-D72ZQPHTWE3W' }] });
    });

    it('Should be a function', () => {
        expect(typeof lambdaController.setFunctionList).toEqual('function');
    });

    it('Should have a property of Functions', () => {
        expect(lambdaController.functionList.hasOwnProperty("Functions")).toEqual(true);
    });

    it('Should have function name in functionList', () => {
        expect(lambdaController.functionList.Functions[1].FunctionName).toEqual('testApp-TestFunction5-6H67G6EFI5PK');
    });

});


describe("createTagGroup test/s", () => {
    before(() => {
        lambdaController.setFunctionList({ Functions: [{ FunctionName: 'testApp-TestFunction4-1LPS6WA57I0WJ' }, { FunctionName: 'testApp-TestFunction5-6H67G6EFI5PK' }, { FunctionName: 'testApp-TestFunction6-D72ZQPHTWE3W' }] });
        lambdaController.createTagGroup("#HelloWorld1", "TestFunction6");
    });

    it('Should be a function', () => {
        expect(typeof lambdaController.createTagGroup).toEqual('function');
    });

    it('Should have property of tagGroup "#HelloWorld1"', () => {
        expect(lambdaController.tagGroups.hasOwnProperty("#HelloWorld1")).toEqual(true);
    });

    it('Should be an array as the value of the tagGroup key', () => {
        expect(Array.isArray(lambdaController.tagGroups['#HelloWorld1'])).toEqual(true);
    });

    it("Should have the correct function name in tagGroup", () => {
        expect(lambdaController.tagGroups['#HelloWorld1'][0]).toEqual('testApp-TestFunction6-D72ZQPHTWE3W');
    });

});