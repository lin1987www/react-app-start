/*
    let promise = new PromiseMemo(
        fn:function(resolve?:function, reject?:function, config?):?promise,
        dependencies?:Array<any>,
        config?:Object
    );

    config:{
        cacheMs?: number,
        retry?: boolean|function(reason:any, config):boolean|number ,
        retryInterval?: number,
        callerPool?: callerPool,
    }
*/
const Caller = (function () {
    function Caller(callback) {
        if (!(this instanceof Caller)) {
            throw new Error("Instantiate Caller with `new` keyword");
        }
        this.callback = callback;
        this.callee = null;
        //
        let state = Caller.STATE_IDLE;
        this.getState = () => state;
        //
        const catchError = (e) => {
            console.log(e); // eslint-disable-line no-console
            setResult(e);
        };
        //
        let result = null;
        this.getResult = () => result;
        const setResult = (value) => {
            if (Promise.resolve(value) === value) {
                // If returned value is a Promise
                const promise = value;
                promise.then(setResult, catchError);
                return;
            }
            if (state === Caller.STATE_IDLE) {
                throw new Error("Already call setResult!");
            }
            state = Caller.STATE_IDLE;
            result = value;
            this.callback && this.callback(result);
        };
        //  execute :: callee -> undefined
        //      callee :: () -> result
        //      callee :: (resolve, reject) -> undefined
        this.execute = (callee) => {
            if (!(callee instanceof Function)) {
                return;
            }
            if (state === Caller.STATE_EXECUTING) {
                throw Error("Already call execute!");
            }
            state = Caller.STATE_EXECUTING;
            this.callee = callee;

            if (callee.length > 0) {
                // We presume callee is promise executor function
                const promise = new Promise(callee);
                setResult(promise);
            } else {
                try {
                    setResult(callee());
                } catch (e) {
                    catchError(e);
                }
            }
        };
    }

    Caller.STATE_IDLE = 'idle';
    Caller.STATE_EXECUTING = 'executing';

    return Caller;
})();

const Handler = (function () {
    function Handler() {
        if (!(this instanceof Handler)) {
            throw new Error("Instantiate Handler with `new` keyword");
        }
        const fns = new Array();
        const caller = new Caller();

        const handle = () => {
            if (caller.getState() === Caller.STATE_IDLE && fns.length > 0) {
                const fn = fns.shift();
                caller.execute(fn);
            }
        };

        caller.callback = () => setTimeout(handle, 0);

        this.post = (fn) => {
            setTimeout(() => fns.push(fn), 0);
            setTimeout(handle, 0);
        };
    }

    return Handler;
})();

const CallerPool = (function () {
    function CallerPool(poolSize) {
        if (!(this instanceof CallerPool)) {
            throw new Error("Instantiate CallerPool with `new` keyword");
        }
        poolSize = poolSize || 1;
        const handler = new Handler();
        const callers = new Array(poolSize);
        const fns = new Array();

        const execute = () => {
            const idleCaller = callers.find(caller => caller.getState() === Caller.STATE_IDLE);
            if (idleCaller && fns.length > 0) {
                const fn = fns.shift();
                idleCaller.execute(fn);
            }
        };

        const post = (fn) => {
            handler.post(() => fns.push(fn));
            handler.post(execute);
        };
        this.post = post;

        const callback = () => handler.post(execute);

        for (let i = 0; i < poolSize; i++) {
            callers[i] = new Caller(callback);
        }
    }

    return CallerPool;
})();

const FlexibleCallerPool = (function () {
    // threshold ms
    function FlexibleCallerPool(poolSize, threshold) {
        if (!(this instanceof FlexibleCallerPool)) {
            throw new Error("Instantiate FlexibleCallerPool with `new` keyword");
        }
        poolSize = poolSize || 1;
        threshold = threshold || 500;

        const handler = new Handler();
        const callers = [];
        const pauseCallerIndex = [];
        const fns = [];
        const executeTimeArray = [];

        const execute = () => {
            const idleCaller = callers.find(
                (caller, index) =>
                    (caller.getState() === Caller.STATE_IDLE) &&
                    (!pauseCallerIndex.includes(index))
            );
            if (idleCaller && fns.length > 0) {
                executeTimeArray.push(Date.now());
                const fn = fns.shift();
                idleCaller.execute(fn);
            }
        };

        const post = (fn) => {
            handler.post(() => fns.push(fn));
            handler.post(execute);
        };
        this.post = post;

        function callback(index) {
            const intervalTime = Date.now() - executeTimeArray.shift();

            const callerPoolSize = callers.length - pauseCallerIndex.length;
            const taskSize = fns.length;
            if (intervalTime > threshold && callerPoolSize > taskSize && callerPoolSize > poolSize) {
                // The task take time longer then we expect, so we reduce caller pool
                pauseCaller(index);
            } else if (intervalTime < threshold && callerPoolSize < taskSize) {
                // The task take time shorter then we expect, so we add more caller to execute
                addCaller();
                handler.post(execute);
                // Post another execute for added Caller to execute
                handler.post(execute);
            } else {
                handler.post(execute);
            }
        }

        function addCaller() {
            if (pauseCallerIndex.length > 0) {
                pauseCallerIndex.sort((a, b) => a - b);
                pauseCallerIndex.shift();
            } else {
                const index = callers.length;
                const caller = new Caller(callback.bind(null, index));
                callers.push(caller);
            }
        }

        function pauseCaller(index) {
            pauseCallerIndex.push(index);
        }

        for (let i = 0; i < poolSize; i++) {
            addCaller();
        }

        this.getState = () => {
            let idleCount = 0;
            let executingCount = 0;
            for (let index = 0; index < callers.length; index++) {
                const caller = callers[index];
                const state = caller.getState();
                if (state === Caller.STATE_IDLE) {
                    idleCount = idleCount + 1;
                } else if (state === Caller.STATE_EXECUTING) {
                    executingCount = executingCount + 1;
                    if (pauseCallerIndex.includes(index)) {
                        throw new Error('Should be paused ' + state);
                    }
                } else {
                    throw new Error('Miss State ' + state);
                }
            }

            return {
                idleCount: idleCount,
                executingCount: executingCount,
                pausedCount: pauseCallerIndex.length,
                callers: callers,
                pauseCallerIndex: pauseCallerIndex,
                fns: fns,
                executeTimeArray: executeTimeArray
            };
        };
    }

    return FlexibleCallerPool;
})();

const PromiseMemo = (function () {
    const memoRoot = {};

    const memoSymbol = Symbol.for('memo');

    let defaultConfig = {
        cacheMs: 0,
        retry: false,
        retryInterval: 0,
        callerPool: null,
        // Information properties
        retryTimes: 0,
    };

    let defaultCallerPool = new CallerPool(5);

    const handler = new Handler();

    function newMemo() {
        return {
            isExecuting: false,
            expiresMs: 0,
            lastPromise: null,
            dependencies: null
        };
    }

    function getMemo(dependencies) {
        let memo = null;
        if (!dependencies || dependencies.length == 0) {
            memo = newMemo();
        } else {
            let memoNode = memoRoot;
            for (let i = 0; i < dependencies.length; i++) {
                const key = dependencies[i];
                memoNode[key] = memoNode[key] || {};
                memoNode = memoNode[key];
            }
            memoNode[memoSymbol] = memoNode[memoSymbol] || newMemo();
            memo = memoNode[memoSymbol];
        }
        memo.dependencies = dependencies.slice();
        return memo;
    }

    function executorImpl(resolve, reject, fn, config, memo) {
        const delegateResolve = (value) => {
            resolve(value);
            memo.expiresMs = config.cacheMs + Date.now();
            memo.isExecuting = false;
        };

        const delegateReject = (reason) => {
            if ((config.retry instanceof Function) ?
                config.retry(reason, config) :
                Number.isInteger(config.retry) ?
                    (config.retry-- > 0) :
                    config.retry
            ) {
                config.retryTimes += 1;
                setTimeout(executeImpl, config.retryInterval);
            } else {
                reject(reason);
                memo.isExecuting = false;
            }
        };

        // Return promise for waiting callback
        function executeImpl() {
            // To make sure the result is not promise, so we wrap fn with a Promise, then we handle the final result
            const promise = new Promise((resolve, reject) => {
                fn(resolve, reject, config);
            });
            return promise.then(delegateResolve, delegateReject);
        }

        return executeImpl();
    }

    function execute(resolve, reject, fn, dependencies, config) {
        const memo = getMemo(dependencies);
        if (!memo.isExecuting && Date.now() > memo.expiresMs) {
            memo.isExecuting = true;
            memo.lastPromise = new Promise((resolve, reject) => {
                const callerPool = config.callerPool || defaultCallerPool;
                const callee = executorImpl.bind(null, resolve, reject, fn, config, memo);
                callerPool.post(callee);
            });
        }
        memo.lastPromise.then(resolve, reject);
    }

    function PromiseMemo(fn, dependencies, config) {
        if (!(this instanceof PromiseMemo)) {
            throw new Error("Instantiate PromiseMemo with `new` keyword");
        }
        if (!Array.isArray(dependencies)) {
            throw new Error("The dependencies that second parameter of PromiseMemo must be a Array.");
        }
        dependencies = dependencies || [];
        config = config || {};
        const configMerge = Object.assign({}, defaultConfig, config);
        // Object.assign will change first parameter object, it is not pure function.
        // Object.assign make config to extending property
        Object.assign(config, configMerge);
        let promise = new Promise((resolve, reject) => {
            handler.post(execute.bind(null, resolve, reject, fn, dependencies, config));
        });
        return promise;
    }

    PromiseMemo.getDefaultCallerPool = () => defaultCallerPool;
    PromiseMemo.setDefaultCallerPool = (value) => {
        defaultCallerPool = value;
    };

    PromiseMemo.getDefaultConfig = () => defaultConfig;
    PromiseMemo.setDefaultConfig = (value) => {
        defaultConfig = value;
    };

    PromiseMemo.getMemo = getMemo;

    PromiseMemo.memoRoot = memoRoot;

    return PromiseMemo;
})();

export {
    Caller,
    Handler,
    CallerPool,
    FlexibleCallerPool,
    PromiseMemo as default
};