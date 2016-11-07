// To run the tests in the terminal, uncomment chai require statement and run: 'npm run test'
var chai = require('chai');
var AddClass = require('./../src/utils/AddClass');
// This var declaration is for use in the testrunner.html file
var assert = chai.assert;

describe('Array', function() {
  it('should start empty', function() {
    var arr = [];

    assert.equal(arr.length, 0);
  });
});
