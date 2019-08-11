var liushuaimaya = function () {
  const isString = value => Object.prototype.toString.call(value) == "[object String]";
  const isArguments = value => Object.prototype.toString.call(value) == "[object Arguments]";
  const isBoolean = value => Object.prototype.toString.call(value) == "[object Boolean]"
  const isDate = value => Object.prototype.toString.call(value) == "[object Date]";
  const isSet = value => Object.prototype.toString.call(value) == "[object Set]";
  const isMap = value => Object.prototype.toString.call(value) == "[object Map]";
  const isElement = value => Object.prototype.toString.call(value) == "[object HTMLScriptElement]";
  const isError = value => Object.prototype.toString.call(value) == "[object Error]";
  const isFunction = value => Object.prototype.toString.call(value) == "[object Function]";
  const isNumber = value => Object.prototype.toString.call(value) == "[object Number]";
  const isNaN = value => isNumber(value) && value.toString() == "NaN";
  const isRegExp = value => Object.prototype.toString.call(value) == "[object RegExp]";
  const isUndefined = value => Object.prototype.toString.call(value) == "[object Undefined]";
  const isNil = value => value === undefined || value === null;
  const isObject = value => value instanceof Object;
  const isNull = value => value === null;
  const isFinite = Number.isFinite;
  const isArray = Array.isArray;
  const toArray = value => isObject(value) ? Object.entries(value).map(it => it[1]) : isString(value) ? value.split("") : [];
  const isArrayLike = value => !isFunction(value) && value !== undefined && value !== null && value.length >= 0 && value.length <= Number.MAX_SAFE_INTEGER;
  const isArrayLikeObject = value => isArrayLike(value) && isObject(value);
  const sameValueZero = (x, y) => {
    if (typeof x != typeof y) return false;
    if (isNumber(x)) {
      if (isNaN(x) && isNaN(y)) return true;
      if (x === +0 && y === -0) return true;
      if (x === -0 && y === +0) return true;
      if (x === y) return true;
    }
    return x == y;
  }
  const isEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null || typeof a != "object" || typeof b != "object") return false;
    let keysA = Object.keys(a), keysB = Object.keys(b);
    if (keysA.length != keysB.length) return false;
    for (let key of keysA) {
      if (!keysB.includes(key) || !isEqual(a[key], b[key])) return false;
    }
    return true;
  };
  const isEmpty = value => {
    if (isArguments(value) || isArray(value) || isString(value) || isFunction(value)) return !value.length;
    if (isMap(value) || isSet(value)) return !value.size;
    for (let key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) return false;
    }
    return true;
  }
  const identity = (...args) => args[0];
  const toPath = path => isString(path) ? path.match(/\b\w+\b/g) : path;
  const isMatch = (obj, src) => {
    if (obj === src) return true;
    if (obj == null || typeof obj != "object" || typeof src != "object") return false;
    let keysObj = Object.keys(obj), keysSrc = Object.keys(src);
    for (let key of keysSrc) {
      if (!keysObj.includes(key) || !isMatch(obj[key], src[key])) return false;
    }
    return true;
  };
  const matches = src => obj => isMatch(obj, src);
  const property = path => obj => toPath(path).reduce((res, it) => res[it], obj);
  const matchesProperty = (path, srcValue) => obj => isMatch(property(path)(obj), srcValue);
  const iteratee = (func = identity) => isRegExp(func) ? str => func.test(str) : isFunction(func) ? func : isArray(func) ? matchesProperty(func[0], func[1]) : isString(func) ? property(func) : isObject(func) ? matches(func) : func;
  const chunk = (ary, size) => ary.map((_, i) => i % size ? null : ary.slice(i, i + size)).filter(Boolean);
  const compact = ary => ary.filter(Boolean);
  const difference = (ary, ...args) => ary.filter(x => !args.flat().includes(x));
  const drop = (arr, n = 1) => arr.slice(n);
  const dropRight = (arr, n = 1) => arr.slice(0, n ? -n : arr.length);
  const flatten = ary => [].concat(...ary);
  const flattenDeep = ary => ary.reduce((res, it) => res.concat(Array.isArray(it) ? flattenDeep(it) : it), []);
  const flattenDepth = (ary, depth = 1) => depth ? [].concat(...flattenDepth(ary, depth - 1)) : ary;
  const indexOf = (arr, val, fromIndex = 0) => arr.indexOf(val, fromIndex);
  const flip = f => (...args) => f(...args.reverse());
  const toObj = collection => {
    if (collection.length != undefined) {
      let res = {};
      for (let i = 0; i < collection.length; i++) {
        res[i] = collection[i];
      }
      return res;
    }
    return collection;
  };
  const forIn = (obj, func = identity) => {
    func = iteratee(func);
    for (let key in obj) {
      if (func(obj[key], key, obj) === false) {
        break;
      };
    }
    return obj;
  };
  const forOwn = (obj, func = identity) => {
    func = iteratee(func);
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (func(obj[key], key, collection) === false) {
          break;
        }
      }
    }
    return obj;
  };
  const forEach = (collection, func = identity) => {
    func = iteratee(func);
    if (isArrayLikeObject(collection)) {
      for (let i = 0; i < collection.length; i++) {
        if (func(collection[i], i, collection) === false) {
          return collection;
        }
      }
    } else {
      return forIn(collection, func);
    }
  };
  const filter = (collection, predicate = identity) => {
    predicate = iteratee(predicate);
    return isArrayLikeObject(collection) ?
      collection.reduce((res, value, index) => predicate(value, index, collection) ? [...res, value] : res, []) :
      Object.keys(collection).reduce((res, key) => predicate(collection[key], key, collection) ? [...res, value] : res, []);
  };
  const map = (collection, func = identity) => {
    func = iteratee(func);
    return isArrayLikeObject(collection) ?
      collection.reduce((res, value, index) => res.concat(func(value, index, collection)), []) :
      Object.keys(collection).reduce((res, key) => res.concat(func(collection[key], key, collection)), []);
  };
  const reduce = (collection, func = identity, accumulator) => {
    let obj = toObj(collection);
    func = iteratee(func);
    if (accumulator === undefined) {
      accumulator = collection[0];
      delete obj[0];
    }
    for (let key in obj) {
      accumulator = func(accumulator, obj[key], key, collection);
    }
    return accumulator;
  };
  const some = (collection, predicate = identity) => {
    predicate = iteratee(predicate);
    return isArrayLikeObject(collection) ?
      collection.reduce((res, value, index) => res || predicate(value, index, collection), false) :
      Object.keys(collection).reduce((res, key) => res || predicate(collection[key], key, collection), false);
  };
  const every = (collection, predicate = identity) => {
    predicate = iteratee(predicate);
    return isArrayLikeObject(collection) ?
      collection.reduce((res, value, index) => res && predicate(value, index, collection), true) :
      Object.keys(collection).reduce((res, key) => res && predicate(collection[key], key, collection), true);
  };
  const memoize = f => (memo = {}, (...args) => args in memo ? memo[args] : memo[args] = f(...args));
  const spread = f => args => f(...args);
  const any = (f, n = f.length) => (...args) => f(...args.slice(0, n));
  // let mapvalues = (obj, f) => {
  //   for (key in obj) {
  //     obj[key] = f(obj[key], key, obj);
  //   }
  //   return obj;
  // }
  const bind = (f, ...args1) => (...args2) => f(...args1, ...args2);
  const negate = f => (...args) => !f(...args);
  const differenceBy = (ary, ...args) => {
    let f = it => it, last = args.pop();
    if (typeof last == "function") f = last;
    if (Array.isArray(last)) args.push(last);
    if (typeof last == "string") f = obj => last.split(".").reduce((re, p) => re[p], obj);
    return ary.filter(x => !args.flat().map(it => f(it)).includes(f(x)));
  };
  const dropRightWhile = (arr, pred) => {
    let funcs = {
      "[object Function]": pred,
      "[object String]": obj => pred.split(".").reduce((re, p) => re[p], obj),
      "[object Array]": obj => (Array.isArray(pred[0]) ? pred[0] : pred[0].split(".")).reduce((re, key) => re[key], obj) == pred[1],
      "[object Object]": obj => Object.keys(pred).every(key => key in obj && obj[key] == pred[key])
    }
    let f = funcs[Object.prototype.toString.call(pred)];
    let copy = arr.slice().reverse();
    return copy.slice(copy.findIndex(it => !f(it))).reverse();
  };
  const dropwhile = (arr, predicate = identity) => {

  };




  return {
    isString,
    isArguments,
    isBoolean,
    isDate,
    isSet,
    isMap,
    isElement,
    isError,
    isFunction,
    isNumber,
    isNaN,
    isRegExp,
    isUndefined,
    isNil,
    isObject,
    isNull,
    isFinite,
    isArray,
    toArray,
    isArrayLike,
    isArrayLikeObject,
    sameValueZero,
    isEqual,
    isEmpty,
    identity,
    toPath,
    isMatch,
    matches,
    property,
    matchesProperty,
    iteratee,
    chunk,
    compact,
    difference,
    drop,
    dropRight,
    flatten,
    flattenDeep,
    flattenDepth,
    indexOf,
    flip,
    forIn,
    forEach,
    filter,
    map,
    reduce,
    every,
    some,
    memoize,
    spread,
    any,
    bind,
    negate,
    forOwn,
    differenceBy,
    dropRightWhile,
    dropwhile
  }
}();