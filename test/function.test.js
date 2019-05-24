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
        it('Promise Callback', function (done) {
            const promise = new Promise((resolve, reject) => {
                resolve(200);
                resolve(202);
                reject(404);
                reject(500);
            });

            function returnValue(value) {
                return value;
            }

            Promise.all([
                promise.then(returnValue).catch(console.log),
                promise.then(returnValue).catch(console.log)
            ]).then(values => {
                expect(values).to.deep.equal([200, 200]);
                done();
            });
        });
        it('Prototype', function () {
            function FunctionArray() {
                let instance = this;
                const prototype = Object.getPrototypeOf(this);
                const superPrototype = Object.getPrototypeOf(prototype);
                const superConstructor = superPrototype.constructor;
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
                instance = superConstructor.apply(instance, arguments) || instance;
                Object.setPrototypeOf(instance, prototype);
                // Using bind
                // https://github.com/facebook/react/issues/9851
                instance.push = instance.push.bind(instance);
                return instance;
            }

            Object.setPrototypeOf(FunctionArray, Array);
            Object.setPrototypeOf(FunctionArray.prototype, Array.prototype);
            FunctionArray.prototype.push = function () {
                // arguments is an Array-like object
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
                const args = [];
                for (let i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                const superPrototype = Object.getPrototypeOf(FunctionArray.prototype);
                superPrototype.push.apply(this, args.filter((arg) => (typeof arg === 'function')));
            };
            const fnArray = new FunctionArray();
            fnArray.push(123);
            expect(fnArray).to.deep.equal([]);
            fnArray.push(FunctionArray);
            expect(fnArray).to.deep.equal([FunctionArray]);
            assert.equal(fnArray.length, 1);
        });
    });
});