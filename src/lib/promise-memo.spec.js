const {assert, expect, should} = require('chai'); // eslint-disable-line no-unused-vars
import PromiseMemo, {Caller, Handler, CallerPool, FlexibleCallerPool} from "./promise-memo";

console.log('\n\n'); // eslint-disable-line no-console

describe('PromiseMemo Test', function () {
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
    it('FlexibleCallerPool', function (done) {
        const faster = 0;
        const threshold = 20;
        const slower = 40;
        const callerPool = new FlexibleCallerPool(1, threshold);

        function logState(msg = '') {
            const {idleCount, executingCount, pausedCount, callers, fns} = callerPool.getState();
            console.log(`fns: ${fns.length} callers: ${callers.length} idle: ${idleCount} paused: ${pausedCount} executing: ${executingCount} ${msg}`); // eslint-disable-line no-console
        }

        function task(ms) {
            return new PromiseMemo((resolve) => {
                setTimeout(() => {
                    logState();
                    resolve();
                }, ms);
            }, [], {callerPool: callerPool});
        }

        for (let i = 0; i < 100; i++) {
            if (i < 10) {
                task(faster);
            } else if (i < 20) {
                task(slower);
            } else if (i < 30) {
                task(faster);
            } else if (i < 40) {
                task(slower);
            } else if (i < 50) {
                task(faster);
            } else {
                task(slower);
            }
        }

        function finalTask(ms) {
            return new PromiseMemo((resolve) => {
                setTimeout(() => {
                    logState('Final');
                    resolve();
                    done();
                }, ms);
            }, [], {callerPool: callerPool});
        }

        finalTask(faster);
    });


    it('PromiseMemo.cache', function (done) {
        const cacheMs = 200;
        const executingMs = 50;
        let countOfCalled = 0;
        const apiAddOne = (value) => {
            countOfCalled += 1;
            return value + 1;
        };
        const executor = (resolve, reject, config) => {
            const result = apiAddOne(0);
            setTimeout(() => {
                config.cacheMs = cacheMs;
                resolve(result);
            }, executingMs);
        };
        const p1 = new PromiseMemo(executor, [apiAddOne, 0]);
        p1.then((value) => {
            assert.equal(value, 1);
        });
        const p2 = new PromiseMemo(executor, [apiAddOne, 0]);
        p2.then((value) => {
            assert.equal(value, 1);
        });
        const p3 = new PromiseMemo(executor, [apiAddOne, 0]);
        p3.then((value) => {
            assert.equal(value, 1);
        });
        setTimeout(() => {
            assert.equal(countOfCalled, 1);
            const p4 = new PromiseMemo(executor, [apiAddOne, 0]);
            p4.then((value) => {
                assert.equal(value, 1);
                assert.equal(countOfCalled, 2);
                done();
            });
        }, executingMs + cacheMs + 50);
    });
    it('PromiseMemo.retry using function', function (done) {
        const cacheMs = 200;
        const executingMs = 50;
        let countOfCalled = 0;
        const configOutside = {
            retry: (reason, config) => {
                assert.equal(reason, 'Error');
                return (config.retryTimes < 2);
            }
        };
        const apiAdd3Throw2TimesError = (value) => {
            countOfCalled += 1;
            if (countOfCalled < 3) {
                throw 'Error';
            }
            return value + countOfCalled;
        };
        const executor = (resolve, reject, config) => {
            assert.equal(configOutside, config);
            const result = apiAdd3Throw2TimesError(0);
            setTimeout(() => {
                config.cacheMs = cacheMs;
                resolve(result);
            }, executingMs);
        };
        const p1 = new PromiseMemo(executor, [apiAdd3Throw2TimesError, 0], configOutside);
        p1.then((value) => {
            assert.equal(value, 3);
            assert.equal(countOfCalled, 3);
            done();
        });
    });
    it('PromiseMemo.retry using number', function (done) {
        const cacheMs = 200;
        const executingMs = 50;
        let countOfCalled = 0;
        const apiAddOne1 = (value) => {
            countOfCalled += 1;
            return value + 1;
        };
        const executor = (resolve, reject, config) => {
            const result = apiAddOne1(0);
            setTimeout(() => {
                if (config.retryTimes < 2) {
                    reject(result);
                } else {
                    config.cacheMs = cacheMs;
                    resolve(result);
                }
            }, executingMs);
        };
        const p1 = new PromiseMemo(executor, [apiAddOne1, 0], {
            retry: 2
        });
        p1.then((value) => {
            assert.equal(value, 1);
            assert.equal(countOfCalled, 3);
            done();
        });
    });
    it('PromiseMemo.retry using boolean', function (done) {
        const cacheMs = 200;
        const executingMs = 50;
        let countOfCalled = 0;
        const apiAddOne2 = (value) => {
            countOfCalled += 1;
            return value + 1;
        };
        const executor = (resolve, reject, config) => {
            const result = apiAddOne2(0);
            setTimeout(() => {
                if (config.retryTimes < 4) {
                    reject(result);
                } else {
                    config.cacheMs = cacheMs;
                    resolve(result);
                }
            }, executingMs);
        };
        const p1 = new PromiseMemo(executor, [apiAddOne2, 0], {
            retry: true
        });
        p1.then((value) => {
            assert.equal(value, 1);
            assert.equal(countOfCalled, 5);
            done();
        });
    });

});