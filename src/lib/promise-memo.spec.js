const {assert, expect, should} = require('chai');
import PromiseMemo, {Caller, Handler, CallerPool} from "./promise-memo";

console.log('\n\n');

describe('Promise memo Test', function () {
    it('Caller', function (done) {
        const caller = new Caller();
        caller.callback = () => {
            assert.equal(caller.getState(), Caller.STATE_IDLE);
            done();
        };
        assert.equal(caller.getState(), Caller.STATE_IDLE);
        caller.execute((resolve) => {
            setTimeout(() => resolve(0), 100);
        });
        assert.equal(caller.getState(), Caller.STATE_EXECUTING);
    });
    it('Handle', function (done) {
        const handler = new Handler();
        let number = 0;
        assert.equal(number, 0);
        handler.post(() => {
            number += 1;
        });
        handler.post(() => {
            number += 2;
        });
        handler.post(() => {
            assert.equal(number, 3);
        });
        handler.post(() =>
            new Promise(resolve => {
                setTimeout(() => {
                    number += 3;
                    assert.equal(number, 6);
                    resolve();
                }, 200);
            })
        );
        handler.post(
            resolve => {
                setTimeout(() => {
                    number += 4;
                    assert.equal(number, 10);
                    resolve();
                }, 0);
            }
        );
        handler.post(() =>
            new Promise(resolve => {
                setTimeout(() => {
                    assert.equal(number, 10);
                    resolve();
                    done();
                }, 0);
            })
        );
    });
    it('CallerPool', function (done) {
        const callerPool = new CallerPool(2);
        let number = 0;

        callerPool.post(() =>
            new Promise(resolve => {
                setTimeout(() => {
                    number += 3;
                    assert.equal(number, 3);
                    resolve();
                }, 200);
            })
        );
        callerPool.post(
            resolve => {
                setTimeout(() => {
                    number += 4;
                    assert.equal(number, 7);
                    resolve();
                }, 200);
            }
        );
        callerPool.post(() =>
            new Promise(resolve => {
                setTimeout(() => {
                    assert.equal(number, 12);
                    resolve();
                }, 200);
            })
        );
        callerPool.post(() =>
            new Promise(resolve => {
                setTimeout(() => {
                    number += 5;
                    assert.equal(number, 12);
                    resolve();
                    done();
                }, 100);
            })
        );
    });
    it('PromiseMemo.cache', function (done) {
        const cacheMs = 200;
        const executingMs = 50;
        let countOfCalled = 0;
        const plus1 = (value) => {
            countOfCalled += 1;
            return value + 1;
        };
        const executor1 = (resolve, reject, config) => {
            const result = plus1(0);
            if (config) {
                config.cacheMs = cacheMs;
            }
            setTimeout(() => resolve(result), executingMs);
        };
        const p1 = new PromiseMemo(executor1, [plus1, 0]);
        p1.then((value) => {
            assert.equal(value, 1);
        });
        const p2 = new PromiseMemo(executor1, [plus1, 0]);
        p2.then((value) => {
            assert.equal(value, 1);
        });
        const p3 = new PromiseMemo(executor1, [plus1, 0]);
        p3.then((value) => {
            assert.equal(value, 1);
        });
        setTimeout(() => {
            assert.equal(countOfCalled, 1);
            const p4 = new PromiseMemo(executor1, [plus1, 0]);
            p4.then((value) => {
                assert.equal(value, 1);
                assert.equal(countOfCalled, 2);
                done();
            });
        }, executingMs + cacheMs + 50);
    });
    it('PromiseMemo.retry', function (done) {
        const cacheMs = 200;
        const executingMs = 50;
        let countOfCalled = 0;
        const plus1 = (value) => {
            countOfCalled += 1;
            if (countOfCalled < 3) {
                throw 'Error';
            }
            return value + countOfCalled + 1;
        };
        const executor1 = (resolve, reject, config) => {
            if (config) {
                config.cacheMs = cacheMs;
                config.retry = (config.retryTimes < 2);
            }
            const result = plus1(0);
            setTimeout(() => resolve(result), executingMs);
        };
        const p1 = new PromiseMemo(executor1, [plus1, 0]);
        p1.then((value) => {
            assert.equal(value, 4);
            assert.equal(countOfCalled, 3);
            done();
        });

    });
});