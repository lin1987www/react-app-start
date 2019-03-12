import {assert, expect, should} from 'chai'; // eslint-disable-line no-unused-vars

describe('ES6 webpack', () => {
    describe('Destructuring assignment', () => {
        it('Class', () => {
            // https://github.com/facebook/react/issues/9851?fbclid=IwAR1R6SzAV16JkOGbrvFduWxHXyvZuo1sCvj2wtQ4n7uoAAXbZTncphThLcY
            // https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1
            class Animal {
                // On Class[Animal]
                static arrowFuncThis = () => this;

                static funcThis() {
                    return this;
                }

                // On instance object
                arrowFuncThis = () => this;

                // On Class.prototype[Animal.prototype]
                funcThis() {
                    return this;
                }
            }

            class People extends Animal {
                // On Class[People]
                static arrowFuncThis = () => this;

                static funcThis() {
                    return super.funcThis();
                }

                // On instance object
                arrowFuncThis = () => super.arrowFuncThis();

                // On Class.prototype[People.prototype]
                funcThis() {
                    return super.funcThis();
                }
            }

            assert.equal(People.arrowFuncThis(), undefined);
            assert.equal(People.funcThis(), People);
            assert.equal(Animal.arrowFuncThis(), undefined);
            assert.equal(Animal.funcThis(), Animal);
            assert.equal(Animal.funcThis.bind(People)(), People);

            let john = new People();
            assert.equal(john.funcThis(), john);
            assert.equal(john.funcThis.bind(Animal)(), Animal);
            let johnFuncThis = john.funcThis;
            assert.equal(johnFuncThis(), undefined);

            expect(john.arrowFuncThis).to.throw();
            expect(john.arrowFuncThis.bind(john)).to.throw();

            let animal = new Animal();
            assert.equal(animal.arrowFuncThis(), animal);
            assert.equal(animal.arrowFuncThis.bind(john)(), animal);
        });
    });
});