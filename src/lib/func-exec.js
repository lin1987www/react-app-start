function exec(func, deps) {
    this.status = exec.PENDING;
    this.startTime = null;
    this.endTime = null;

    this.timeout = 0;
    this.isCanceled = false;

    this.func = func; // (resolve, reject)=>{}
    this.deps = deps;

    this.result = null;
    this.cacheTime = 0;

    this.error = null;

    this.retryHandler = null;
    this.retryCount = 0;
    this.retryLimit = 0;
    this.retryInterval = 0;

    this.promise = this.promise.bind(this);
}

exec.PENDING = 'pending';
exec.FULFILLED = 'fulfilled';
exec.REJECTED = 'rejected';

exec.prototype.promise = function (timeout = 0) {
    if (timeout < 0) {
        this.timeout = 0;
    } else {
        this.timeout = timeout;
    }
    this.startTime = (new Date()).getTime();

    // 1. immediate 2. callback 3. promise
};