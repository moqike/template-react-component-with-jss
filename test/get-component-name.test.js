const assert = require('assert');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const sinon = require('sinon');
const inquirer = require('inquirer');
const generate = require('../lib/generate');
const testFolderPath = path.resolve(__dirname, '../_test');

const sandbox = sinon.createSandbox();

describe('Generate TestComponent', function() {
  describe('generate()', function() {
    before(function(done) {
      // clean up _test folder
      rimraf(testFolderPath, function (err) {
        fs.mkdirSync(testFolderPath);
        done();
      });
    });
    afterEach(function () {
      sandbox.restore();
    });
    it('should generate Component \'TestComponent\'', async function() {
      const componentPath = path.resolve(testFolderPath, 'TestComponent');
      sandbox.stub(inquirer, 'prompt').onCall(0).resolves({
        name: 'TestComponent'
      });
      await generate(testFolderPath);
      assert.ok(
        fs.existsSync(componentPath)
        && fs.existsSync(path.resolve(componentPath, 'index.tsx'))
        && fs.existsSync(path.resolve(componentPath, 'styles.ts'))
      );
    });
    it('should generated \'AnotherTestComponent\'', async function() {
      const componentPath = path.resolve(testFolderPath, 'AnotherTestComponent');
      const promptStub = sandbox.stub(inquirer, 'prompt');
      promptStub.onCall(0).resolves({
        name: 'TestComponent'
      });
      promptStub.onCall(1).resolves({
        name: 'AnotherTestComponent'
      });
      await generate(testFolderPath);
      assert.ok(
        fs.existsSync(componentPath)
        && fs.existsSync(path.resolve(componentPath, 'index.tsx'))
        && fs.existsSync(path.resolve(componentPath, 'styles.ts'))
      );
    });
  });
});