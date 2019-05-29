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
        it('Lexical environment', function () {
            const A = (function () {
                let foo = 'foo';

                function A() {
                }

                A.prototype.getFoo = function () {
                    return foo;
                };
                A.prototype.setFoo = function (value) {
                    foo = value;
                };
                return A;
            })();

            let a1 = new A();
            assert.equal(a1.getFoo(), 'foo');
            a1.setFoo('bar');
            assert.equal(a1.getFoo(), 'bar');
            let a2 = new A();
            assert.equal(a2.getFoo(), 'bar');
        });
        it('Promise.all', function (done) {
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
        it('Promise execute immediately', function (done) {
            let value = 'foo';

            function getPromise() {
                return new Promise(
                    () => {
                        value = 'bar';
                    }
                );
            }

            assert.equal(value, 'foo');
            getPromise();
            assert.equal(value, 'bar');
            done();
        });
        it('Promise then onFulfilled', function (done) {
            let p1 = new Promise((r) => r(1));
            let p2 = p1.then((value) => {
                assert.equal(value, 1);
                return value + 1;
            });
            let p3 = p2.then((value) => {
                assert.equal(value, 2);
            });
            let p4 = p3.then((value) => {
                assert.equal(value, undefined);
                done();
            });
        });
        it('Promise then onFulfilled throw error', function (done) {
            let p1 = new Promise(() => {
                // When throw error , we need have someone to handle error, or system will print warning
                throw 404;
            });
            // p2, p3 both are handling p1 throwing error
            let p2 = p1.then(null, (reason) => {
                assert.equal(reason, 404);
                throw 4041;
            });
            let p3 = p1.catch((error) => {
                assert.equal(error, 404);
                throw 4042;
            });
            // p4 is handling p2 throwing error
            let p4 = p2.then(null, (reason) => {
                assert.equal(reason, 4041);
                throw 40411;
            }).catch((error) => {
                assert.equal(error, 40411);
                throw error;
            }).catch((error) => {
                assert.equal(error, 40411);
            }).then((value) => {
                assert.equal(value, undefined);
            });
            // p5 is handling p3 throwing error
            let p5 = p3.then(null, (reason) => {
                assert.equal(reason, 4042);
                throw 40422;
            }).catch((error) => {
                assert.equal(error, 40422);
                throw 500;
            }).then(null, (reason) => {
                assert.equal(reason, 500);
                return 200;
            });
            // p5 handle error by self, so p6 didn't reject but fulfilled
            let p6 = p5.then((value) => {
                assert.equal(value, 200);
            }).then((value) => {
                assert.equal(value, undefined);
            });
            setTimeout(done, 600);
        });
    });
});