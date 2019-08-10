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
  const sameValueZero = (x, y) => {
    if(typeof x != typeof y) return false;
    if(isNumber(x)) {
      if(isNaN(x) && isNaN(y)) return true;
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
    if(isArguments(value) || isArray(value) || isString(value) || isFunction(value)) return !value.length;
    if (isMap(value) || isSet(value)) return !value.size;
    for (let key in value) {
      if(Object.prototype.hasOwnProperty.call(value, key)) return false;
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
  const iteratee = (func = identity) => isArray ? matchesProperty(func[0], func[1]) : isString ? property(func) : isObject ? matches(func) : false;
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
  const every = (ary, predicate = identity) => {
    predicate = isFunction(predicate) ? predicate : iteratee(predicate);
    for(let i in ary) {
      if (!predicate(ary[i], i, ary)) {
        return false;
      }
    }
    return true;
  }
  const some = (ary, predicate) => ary.reduce((res, a, i, ary) => res || predicate(a, i, ary), false);
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
  const forOwn = function (obj, f) {
    var hasOwn = Object.prototype.hasOwnProperty;
    for (let key in obj) {
      if (hasOwn.call(obj, key)) {
        f(obj[key], key, obj);
      } else break;
    }
    return obj;
  };
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
    bind,
    negate,
    forOwn,
    identity,
    toPath,
    differenceBy,
    dropRightWhile,
    dropwhile,
    isMatch,
    matches,
    property,
    matchesProperty
  }
}();