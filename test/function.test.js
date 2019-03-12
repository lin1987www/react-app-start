import {assert, expect, should} from 'chai'; // eslint-disable-line no-unused-vars

describe('Mocha Test', function () {
    describe('Basic', function () {
        it('should return number of charachters in a string', function () {
            assert.equal('Hello'.length, 5);
        });
        it('should return first charachter of the string', function () {
            assert.equal('Hello'.charAt(0), 'H');
        });
        it('Calling a method, this is caller, arrow function this is bind by Lexical Environment this.', function () {
            var func = function () {
                console.log(this); // 555
                var func2 = function () {
                    setTimeout(() => {
                        console.log(this);
                    }, 10);
                };
                var func3 = {
                    func: func2,
                    var4: 4
                };
                func2(); // this = window
                func2.call(777); // 777
                func3.func(); // func3 Object
            };
            func.call(555);
        });
    });
});