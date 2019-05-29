const Caller = (function () {
    function isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }

    function Caller(callback) {
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
                promise.then(setResult, setResult).catch(catchError);
                return;
            }
            if (state === Caller.STATE_IDLE) {
                throw Error("Already call setResult!");
            }
            result = value;
            state = Caller.STATE_IDLE;
            this.callback && this.callback(result);
        };
        //
        this.execute = (callee) => {
            if (!isFunction(callee)) {
                return;
            }
            if (state === Caller.STATE_EXECUTING) {
                throw Error("Already call execute!");
            }
            this.callee = callee;
            state = Caller.STATE_EXECUTING;
            try {
                if (callee.length > 0) {
                    // We presume callee is promise executor function
                    const promise = new Promise(callee);
                    setResult(promise);
                } else {
                    setResult(callee());
                }
            } catch (e) {
                catchError(e);
            }
        };
    }

    Caller.STATE_IDLE = 'idle';
    Caller.STATE_EXECUTING = 'executing';

    return Caller;
})();

const Handler = (function () {
    function Handler() {
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
    function CallerPool(size) {
        size = size || 1;
        const handler = new Handler();
        const callers = new Array(size);
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

        for (let i = 0; i < size; i++) callers[i] = new Caller(() => handler.post(execute));
    }

    return CallerPool;
})();

const PromiseMemo = (function () {
    const memoRoot = {};
    // 暫時用字串
    const memoSymbol = Symbol.for('memo');

    const defaultConfig = {
        cacheMs: 0,
        retry: false,
        retryInterval: 0,
        retryTimes: 0,
    };

    let defaultCallerPool = new CallerPool(5);

    const handler = new Handler();

    function newMemo() {
        return {
            isExecuting: false,
            expiresMs: 0,
            lastPromise: null
        };
    }

    function getMemo(dependencies) {
        if (!dependencies || dependencies.length == 0) {
            return newMemo();
        }
        let memoNode = memoRoot;
        for (let i = 0; i < dependencies.length; i++) {
            const key = dependencies[i];
            memoNode[key] = memoNode[key] || {};
            memoNode = memoNode[key];
        }
        memoNode[memoSymbol] = memoNode[memoSymbol] || newMemo();
        let memo = memoNode[memoSymbol];
        return memo;
    }

    function executorImpl(resolve, reject, fn, config, memo) {
        const delegateResolve = (value) => {
            resolve(value);
            memo.expiresMs = config.cacheMs + Date.now();
            memo.isExecuting = false;
        };

        const delegateReject = (reason) => {
            if (config.retry) {
                config.retryTimes += 1;
                setTimeout(executeImpl, config.retryInterval);
            } else {
                reject(reason);
                memo.isExecuting = false;
            }
        };

        function executeImpl() {
            // To make sure the result is not promise, so we wrap fn with a Promise, then we handle the final result
            const promise = new Promise((resolve, reject) => {
                fn(resolve, reject, config);
            });
            promise.then(delegateResolve, delegateReject);
        }

        executeImpl();
    }

    function execute(resolve, reject, fn, dependencies, config) {
        const memo = getMemo(dependencies);
        if (!memo.isExecuting && Date.now() > memo.expiresMs) {
            memo.isExecuting = true;
            memo.lastPromise = new Promise((resolve, reject) => {
                defaultCallerPool.post(executorImpl.bind(null, resolve, reject, fn, config, memo));
            });
        }
        memo.lastPromise.then(resolve, reject);
    }

    function PromiseMemo(fn, dependencies, config) {
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

    PromiseMemo.setDefaultCallerPool = (callerPool) => {
        this.defaultCallerPool = callerPool;
    };

    PromiseMemo.getMemo = getMemo;

    PromiseMemo.memoRoot = memoRoot;

    return PromiseMemo;
})();

export {
    Caller,
    Handler,
    CallerPool,
    PromiseMemo as default
};