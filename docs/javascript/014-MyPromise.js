// 官方文档：https://promisesaplus.com/
// 视频地址：https://www.bilibili.com/video/BV1ph411f7Th

const PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED';

// 判断 x 是否是 promise
function resolvePromise(promise2, x, reslove, reject) {
  // console.log(promise2, x, reslove, reject);
  if (promise2 === x) {
    throw reject(new TypeError('Chaining cycle detected for promise #<MyPromise>'));
  }
  let called = false;
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        // 这肯定是 Promise
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            // 解决.then多层次嵌套promis的递归问题
            resolvePromise(promise2, y, reslove, reject);
            // reslove(y);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        reslove(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    reslove(x);
  }
}

class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const reslove = value => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;

        // 发布
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };
    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;

        // 发布
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    // 捕获 throw 错误
    try {
      executor(reslove, reject);
    } catch (e) {
      reject(e);
    }
  }
  // x 可以是 普通值 也可以是 promise
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
            throw reason;
          };
    let promise2 = new MyPromise((reslove, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, reslove, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, reslove, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      // 发布订阅
      if (this.status === PENDING) {
        // 收集回调 => 订阅
        this.onFulfilledCallbacks.push(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, reslove, reject);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, reslove, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
    });
    // 返回 promise
    return promise2;
  }
  catch(errorCallback) {
    return this.then(null, errorCallback);
  }
}

// test
let promise1 = new MyPromise((resolve, reject) => {
  resolve('Promise1');
  // resolve('Error');
  // setTimeout(() => {
  //   resolve('success');
  // }, 2000);
  // throw new Error('Exception: Error');
});

let promise2 = promise1.then(
  () => {
    // return new Error('Error');
    // return Promise.resolve('Promise resolve')
    // return 'then promise';
    return new MyPromise((reslove, reject) => {
      // reslove('new Promise reslove');
      // setTimeout(() => {
      //   reslove('new Promise reslove');
      // }, 2000);
      setTimeout(() => {
        reslove(
          new MyPromise((reslove, reject) => {
            reslove('new Promise reslove');
          })
        );
      }, 2000);
    });
  },
  reason => {
    return reason;
  }
);

promise2
  .then()
  .then()
  .then(
    value => {
      throw Error('Error');
    },
    reason => {
      console.log(reason);
    }
  )
  .catch(e => {
    console.log(e);
  });

module.export = MyPromise;
