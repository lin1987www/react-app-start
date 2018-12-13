const {assert, expect, should} = require('chai');

describe('Mocha Test', function () {
    describe('Basic', function () {
        it('should return number of charachters in a string', function () {
            assert.equal('Hello'.length, 5);
        });
        it('should return first charachter of the string', function () {
            assert.equal('Hello'.charAt(0), 'H');
        });
    });
});