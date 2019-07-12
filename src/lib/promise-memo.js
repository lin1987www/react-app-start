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
                throw Error("Already call setResult!");
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
    function CallerPool(size) {
        if (!(this instanceof CallerPool)) {
            throw new Error("Instantiate CallerPool with `new` keyword");
        }
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
    PromiseMemo as default
};