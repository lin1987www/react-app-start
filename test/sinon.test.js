import {assert, expect, should} from 'chai'; // eslint-disable-line no-unused-vars
import sinon from 'sinon';

describe('Sinon', () => {
    describe('Spy', () => {
        it('should call method once with each argument', () => {
            let api = {method: x => x};
            let spy = sinon.spy(api, 'method');

            api.method(42);
            api.method(1);

            assert(spy.withArgs(42).calledOnce);
            assert(spy.withArgs(1).calledOnce);
            assert.equal(spy.returnValues[0], 42);
            assert.equal(spy.returnValues[1], 1);
            assert.equal(spy.args[0][0], 42);
            assert.equal(spy.args[1][0], 1);
        });
    });
    describe('Stub', () => {
        it('test should stub method differently based on arguments', function () {
            // Test stubs are functions (spies) with pre-programmed behavior.
            let api = {method: () => 0};
            let callback = sinon.stub(api, 'method').callsFake(() => 2);
            callback.withArgs(42).returns(1);
            callback.withArgs(1).throws(new Error('name'));

            assert.equal(api.method(), 2);
            assert.equal(api.method(42), 1);
            assert.throws(() => api.method(1), Error, 'name');
        });
    });
    describe('Mock', () => {
        it('test should call once when exceptions', () => {
            let api = {
                method: function () {
                }
            };
            let mock = sinon.mock(api);
            mock.expects('method').exactly(1);
            api.method();
            mock.verify();
        });
    });
    describe('Fake', () => {
        function once(fn) {
            let returnValue, called = false;
            return function () {
                if (!called) {
                    called = true;
                    returnValue = fn.apply(this, arguments);
                }
                return returnValue;
            };
        }

        it('calls the original function', () => {
            let callback = sinon.fake();
            let proxy = once(callback);

            proxy();
            proxy();
            proxy();

            assert.equal(callback.called, true);
            assert.equal(callback.callCount, 1);
        });
        it('calls original function with right this and args', () => {
            let callback = sinon.fake();
            let proxy = once(callback);
            let obj = {};

            proxy.call(obj, 1, 2, 3);

            assert(callback.calledOn(obj));
            assert(callback.calledWith(1, 2, 3));
        });
        it('returns the return value from the original function', () => {
            let callback = sinon.fake.returns(42);
            let proxy = once(callback);

            assert.equal(proxy(), 42);
        });
    });
    describe('Fake Clock', () => {
        let clock;
        beforeEach(() => {
            // runs before all tests in this block
            clock = sinon.useFakeTimers();
        });
        afterEach(() => {
            // runs after all tests in this block
            clock.restore();
        });
        it('calls callback after 100ms', function () {
            function debounce(callback) {
                let timer;
                return function () {
                    clearTimeout(timer);
                    let args = [].slice.call(arguments);
                    timer = setTimeout(function () {
                        callback.apply(this, args);
                    }, 100);
                };
            }

            let callback = sinon.fake();
            let throttled = debounce(callback);

            throttled();

            clock.tick(99);
            assert.equal(callback.notCalled, true);

            clock.tick(1);
            assert.equal(callback.calledOnce, true);

            assert.equal(new Date().getTime(), 100);
        });
    });
});