var liushuaimaya = function () {
  const isArray = Array.isArray;
  const isString = value => Object.prototype.toString.call(value) == "[object String]";
  const isArguments = value => Object.prototype.toString.call(value) == "[object Arguments]";
  const isBoolean = value => Object.prototype.toString.call(value) == "[object Boolean]"
  const isDate = value => Object.prototype.toString.call(value) == "[object Date]";
  const isElement = value => Object.prototype.toString.call(value) == "[object HTMLScriptElement]";
  const isEmpty = value => isArguments(value) || isArray(value) || isString(value) ? value.length > 0 : false;
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
  const isError = value => Object.prototype.toString.call(value) == "[object Error]";
  const isFinite = Number.isFinite;
  const isFunction = value => Object.prototype.toString.call(value) == "[object Function]";
  const isNaN = Number.isNaN;
  const isNil = value => value === undefined || value === null;
  const isNull = value => value === null;
  const isNumber = value => Object.prototype.toString.call(value) == "[object Number]";
  const isObject = value => typeof value == "object" || typeof value == "function";
  const isRegExp = value => Object.prototype.toString.call(value) == "[object RegExp]";
  const isUndefined = value => Object.prototype.toString.call(value) == "[object Undefined]";
  const toArray = value => isObject(value) ? Object.entries(a).map(it => it[1]) : isString(value) ? String.split("") : [];
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
  const filter = (collection, predicate) => {
    let res = [];
    for (let index = 0; index < collection.length; index++) {
      if (predicate(collection[index], index, collection)) {
        res.push(collection[index]);
      }
    }
    return res;
  };
  const every = (ary, predicate) => ary.reduce((res, a, i, ary) => res && predicate(a, i, ary), true);
  const some = (ary, predicate) => ary.reduce((res, a, i, ary) => res || predicate(a, i, ary), false);
  const memoize = f => (memo = {}, (...args) => args in memo ? memo[args] : memo[args] = f(...args));
  const spread = f => args => f(...args);
  const any = (f, n = f.length) => (...args) => f(...args.slice(0, n));
  // const mapvalues = (obj, f) => {
  //   for (key in obj) {
  //     obj[key] = f(obj[key], key, obj);
  //   }
  //   return obj;
  // }
  const bind = (f, ...args1) => (...args2) => f(...args1, ...args2);
  const negate = f => (...args) => !f(...args);
  const forOwn = function (obj, f) {
    var hasOwn = Object.prototype.hasOwnProperty;
    for (let key in obj) {
      if (hasOwn.call(obj, key)) {
        f(obj[key], key, obj);
      } else break;
    }
    return obj;
  };
  const identity = (...args) => args[0];
  const toPath = str => str.match(/\b\w+\b/g);
  const differenceBy = (ary, ...args) => {
    let f = it => it, last = args.pop();
    if (typeof last == "function") f = last;
    if (Array.isArray(last)) args.push(last);
    if (typeof last == "string") f = obj => last.split(".").reduce((re, p) => re[p], obj);
    return ary.filter(x => !args.flat().map(it => f(it)).includes(f(x)));
  };
  const dropRightWhile = (arr, pred) => {
    const funcs = {
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
  const property = path => obj => (Array.isArray(path) ? path : path.split(".")).reduce((res, it) => res[it], obj);
  const matchesProperty = (path, srcValue) => {

  }

  return {
    isArray,
    isString,
    isArguments,
    isBoolean,
    isDate,
    isElement,
    isEmpty,
    isEqual,
    isError,
    isFinite,
    isFunction,
    isNaN,
    isNil,
    isNull,
    isNumber,
    isObject,
    isRegExp,
    isUndefined,
    toArray,
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
    filter,
    every,
    some,
    memoize,
    spread,
    any,
    mapvalues,
    bind,
    negate,
    forOwn,
    identity,
    toPath,
    differenceBy,
    dropRightWhile,
    funcs,
    dropwhile,
    isMatch,
    matches,
    property,
    matchesProperty
  }
}();