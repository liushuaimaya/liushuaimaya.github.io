var liushuaimaya = (function () {
  let src = liushuaimayaSrc.toString(); //获得liushuaimayaSrc函数源代码
  let funcNames = src.match(/(?<=const )\b\w+\b(?= =)/g); //获得liushuaimayaSrc内所有函数名组成的字符串数组
  let addReturnObj = `\nreturn {\n\t${funcNames.join(",\n\t")}\n}`; //将函数名join并拼接成需要返回对象的字符串
  return new Function(src.slice(src.indexOf("{") + 1, -1) + addReturnObj); //返回拼接后的新函数
})()();

function liushuaimayaSrc() {
  const getTag = tag => value => Object.prototype.toString.call(value).slice(8, -1) == tag;
  const isString = getTag("String");
  const isArguments = getTag("Arguments");
  const isBoolean = getTag("Boolean");
  const isDate = getTag("Date");
  const isSet = getTag("Set");
  const isMap = getTag("Map");
  const isError = getTag("Error");
  const isFunction = getTag("Function");
  const isNumber = getTag("Number");
  const isRegExp = getTag("RegExp");
  const isUndefined = getTag("Undefined");
  const isNaN = value => isNumber(value) && +value !== value;
  const isObject = value => value instanceof Object;
  const isElement = value => value instanceof Element;
  const isNull = value => value === null;
  const isNil = value => value === undefined || value === null;
  const isFinite = Number.isFinite;
  const isArray = Array.isArray;
  const toArray = value => isObject(value) ? Object.entries(value).map(it => it[1]) : isString(value) ? value.split("") : [];
  const add = (a, b) => a + b;
  const isArrayLike = value => !isFunction(value) && !isString(value) && value !== undefined && value !== null && value.length >= 0 && value.length <= Number.MAX_SAFE_INTEGER;
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
  const toPath = path => isString(path) ? path.match(/\w+/g) : path;
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
  const differenceBy = (array, ...args) => {
    let func = isString(args[args.length - 1]) ? property(args.pop()) : isFunction(args[args.length - 1]) ? args.pop() : it => it;
    return array.filter(val => !args.flat().map(func).includes(func(val)));
  };
  const differenceWith = (array, ...args) => {
    let comparator = isFunction(args[args.length - 1]) ? args.pop() : it => it;
    return array.filter(arrVal => args.flat().every(othVal => !comparator(arrVal, othVal)));
  };
  const drop = (arr, n = 1) => arr.slice(n);
  const dropRight = (arr, n = 1) => arr.slice(0, n ? -n : arr.length);
  const dropRightWhile = (array, predicate = identity) => {
    predicate = iteratee(predicate);
    for (let i = array.length - 1; i < array.length; i--) {
      if (!predicate(array[i], i, array)) {
        return array.slice(0, i + 1);
      }
    }
  };
  const dropWhile = (array, predicate = identity) => {
    predicate = iteratee(predicate);
    for (let i = 0; i < array.length; i++) {
      if (!predicate(array[i], i, array)) {
        return array.slice(i);
      }
    }
  };
  const fill = (array, value, start = 0, end = array.length) => {
    for (let i = start; i < end; i++) {
      array[i] = value;
    }
    return array;
  }
  const findIndex = (array, predicate = identity, fromIndex = 0) => {
    predicate = iteratee(predicate);
    for (let i = fromIndex; i < array.length; i++) {
      if (predicate(array[i])) {
        return i;
      }
    }
    return -1;
  }
  const findLastIndex = (array, predicate = identity, fromIndex = 0) => {
    predicate = iteratee(predicate);
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i])) {
        return i;
      }
    }
    return -1;
  }
  const intersection = (...arrays) => arrays[0].filter(it => arrays.slice(1).every(array => array.includes(it)));
  const intersectionBy = (...args) => {
    let transform = iteratee(args.pop());
    return args[0].filter(it => args.slice(1).every(array => array.some(val => transform(val) == transform(it))));
  }
  const intersectionWith = (...args) => {
    let comparator = iteratee(args.pop());
    return args[0].filter(arrVal => args.slice(1).every(array => array.some(othVal => comparator(othVal, arrVal))));
  }
  const flatten = ary => [].concat(...ary);
  const flattenDeep = ary => ary.reduce((res, it) => res.concat(Array.isArray(it) ? flattenDeep(it) : it), []);
  const flattenDepth = (ary, depth = 1) => depth ? [].concat(...flattenDepth(ary, depth - 1)) : ary;
  const fromPairs = Object.fromEntries;
  const initial = array => array.slice(0, -1);
  const head = array => array[0];
  const indexOf = (array, value, fromIndex = 0) => {
    fromIndex += fromIndex < 0 ? array.length : 0;
    for (let i = fromIndex; i < array.length; i++) {
      if (sameValueZero(value, array[i])) {
        return i;
      }
    }
    return -1;
  }
  const join = (array, separator = ',') => array.reduce(((res, s) => "" + res + separator + s));
  const last = array => array[array.length - 1];
  const lastIndexOf = (array, value, fromIndex = array.length - 1) => {
    for (let i = fromIndex; i >= 0; i--) {
      if (sameValueZero(value, array[i])) {
        return i;
      }
    }
    return -1;
  }
  const nth = (array, n = 0) => n >= 0 ? array[n] : array[-n];
  const pull = (array, ...values) => {
    for (let i = 0; i < array.length;) {
      values.includes(array[i]) ? array.splice(i, 1) : i++;
    }
    return array;
  }
  const pullAll = (array, values) => pull(array, ...values);
  const pullAllBy = (array, values, func = identity) => {
    func = iteratee(func);
    values = values.map(func);
    for (let i = 0; i < array.length;) {
      values.includes(func(array[i])) ? array.splice(i, 1) : i++;
    }
    return array;
  };
  const pullAllWith = (array, values, comparator) => {
    for (let i = 0; i < array.length;) {
      values.some(othVal => comparator(array[i], othVal)) ? array.splice(i, 1) : i++;
    }
    return array;
  };
  const pullAt = (array, indexes) => indexes.sort((a, b) => b - a).reduce((res, i) => [...array.splice(i, 1), ...res], []);
  const reverse = array => array.reverse();
  const sortedIndex = (array, value) => {
    let l = 0, r = array.length - 1;
    while (l <= r) {
      let mid = (l + r) / 2 | 0;
      array[mid] < value ? l = mid + 1 : r = mid - 1;
    }
    return l;
  };
  const sortedIndexBy = (array, value, func = identity) => sortedIndex(array.map(iteratee(func)), iteratee(func)(value));
  const sortedIndexOf = (array, value) => array[index = sortedIndex(array, value)] == value ? index : -1;
  const sortedLastIndex = (array, value) => {
    let l = 0, r = array.length - 1;
    while (l <= r) {
      let mid = (l + r) / 2 | 0;
      array[mid] <= value ? l = mid + 1 : r = mid - 1;
    }
    return l;
  };
  const sortedLastIndexBy = (array, value, func = identity) => {
    func = iteratee(func);
    return sortedLastIndex(array.map(func), func(value));
  }
  const sortedLastIndexOf = (array, value) => array[index = sortedLastIndex(array, value) - 1] == value ? index : -1;
  const sortedUniq = array => [...new Set(array)];
  const sortedUniqBy = (array, func) => {
    func = iteratee(func);
    return array.reduce((res, it) => func(it) !== func(res[res.length - 1]) ? [...res, it] : res, []);
  }
  const tail = array => array.slice(1);
  const take = (array, n = 1) => array.slice(0, n);
  const takeRight = (array, n = 1) => array.slice(n ? -n : array.length);
  const takeRightWhile = (array, predicate = identity) => {
    predicate = iteratee(predicate);
    for (let i = array.length - 1; i >= 0; i--) {
      if (!predicate(array[i], i, array)) {
        return array.slice(i + 1);
      }
    }
  }
  const takeWhile = (array, predicate = identity) => {
    predicate = iteratee(predicate);
    for (let i = 0; i < array.length; i++) {
      if (!predicate(array[i], i, array)) {
        return array.slice(0, i);
      }
    }
  }

  // 
  const union = (...arrays) => [...new Set(arrays.flat())];
  const unionBy = (...arrays) => {
    func = iteratee(arrays.pop());
    let transformed = arrays.flat().map(func);
    return arrays.flat().filter((_, i) => transformed.indexOf(transformed[i]) == i);
  }
  const unionWith = (...arrays) => {
    let array = arrays.flat();
    let comparator = array.pop();
    return array.filter((arrVal, i) => !array.slice(0, i).some(othVal => comparator(arrVal, othVal)));
  };
  const uniq = array => [...new Set(array)];
  const uniqBy = (array, func) => {
    func = iteratee(func);
    let transformed = array.map(func);
    return array.filter((_, i) => transformed.indexOf(transformed[i]) == i);
  }
  const uniqWith = (array, comparator) => array.filter((arrVal, i) => !array.slice(0, i).some(othVal => comparator(arrVal, othVal)));
  const unzip = array => zip(...array);
  const unzipWith = (array, func) => array[0].map((_, i) => iteratee(func)(...array.map(it => it[i])));
  const without = (array, ...values) => array.filter(it => !values.includes(it));
  const xor = (...arrays) => arrays.flat().filter((it, _, arr) => arr.indexOf(it) == arr.lastIndexOf(it));
  const xorBy = (...args) => {
    let arr = args.flat();
    predicate = iteratee(arr.pop());
    let transformed = arr.map(predicate);
    return arr.filter((_, i) => transformed.indexOf(transformed[i]) == transformed.lastIndexOf(transformed[i]));
  }
  const xorWith = (...args) => {
    let comparator = args.pop();
    return args.flat().filter((arrVal, _, arr) => arr.reduce((cnt, othVal) => comparator(arrVal, othVal) ? cnt + 1 : cnt, 0) == 1);
  }
  const zip = (...arrays) => Array(Math.max(...arrays.map(it => it.length))).fill(0).map((_, i) => arrays.map(ary => ary[i]));
  const zipObject = (props = [], values = []) => props.reduce((obj, prop, i) => (obj[prop] = values[i], obj), {});
  const zipObjectDeep = (props = [], values = []) => {
    let res = isNaN(+props[0][0]) ? {} : [];
    for (let i = 0; i < props.length; i++) {
      let path = toPath(props[i]);
      let cur = res;
      for (let j = 0; j < path.length - 1; j++) {
        if (!(path[j] in cur)) {
          cur[path[j]] = (isNaN(+path[j + 1]) ? {} : []);
        }
        cur = cur[path[j]];
      }
      cur[path[path.length - 1]] = values[i];
    }
    return res;
  }
  const zipWith = (...args) => {
    let func = iteratee(args.pop());
    return args[0].map((_, i) => func(...args.map(it => it[i])));
  }
  const countBy = (collection, func = identity) => Object.values(collection).map(iteratee(func)).reduce((res, it) => (it in res ? res[it]++ : res[it] = 1, res), {});
  const flip = f => (...args) => f(...args.reverse());
  const forIn = (obj, func = identity) => {
    func = iteratee(func);
    for (let key in obj) {
      if (func(obj[key], key, obj) === false) {
        break;
      };
    }
    return obj;
  };
  const forOwn = (object, func = identity) => {
    func = iteratee(func);
    for (let key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        if (func(object[key], key, object) === false) {
          break;
        }
      }
    }
    return object;
  };
  const filter = (collection, predicate = identity) => {
    predicate = iteratee(predicate);
    return isArrayLikeObject(collection) ?
      collection.reduce((res, value, index) => predicate(value, index, collection) ? [...res, value] : res, []) :
      Object.keys(collection).reduce((res, key) => predicate(collection[key], key, collection) ? [...res, value] : res, []);
  };
  const find = (collection, predicate = identity) => {
    predicate = iteratee(predicate);
    let arr = Array.from(collection.entries());
    return arr[arr.findIndex(pair => predicate(pair[1], pair[0], collection))][1];
  }
  const findLast = (collection, predicate = identity) => {
    predicate = iteratee(predicate);
    let arr = Array.from(collection.entries()).reverse();
    return arr[arr.findIndex(pair => predicate(pair[1], pair[0], collection))][1];
  }
  const map = (collection, func = identity) => {
    func = iteratee(func);
    if (isArrayLikeObject(collection)) {
      return collection.map((value, index) => func(value, index, collection));
    } else {
      return Object.keys(collection).map(key => func(collection[key], key, collection));
    }
  };

  const flatMap = (collection, func = identity) => map(collection, func).flat();
  const flatMapDeep = (collection, func = identity) => flattenDeep(map(collection, func));
  const flatMapDepth = (collection, func = identity, n) => flattenDepth(map(collection, func), n);
  const forEach = (collection, func = identity) => {
    func = iteratee(func);
    if (isArrayLikeObject(collection)) {
      for (let i = 0; i < collection.length; i++) {
        if (func(collection[i], i, collection) === false) break;
      }
    } else {
      forIn(collection, func);
    }
    return collection;
  };
  const forEachRight = (collection, func = identity) => {
    func = iteratee(func);
    if (isArrayLikeObject(collection)) {
      for (let index = collection.length - 1; index >= 0; index--) {
        if (func(collection[index], index, collection) === false) break;
      }
    } else {
      for (let [key, value] of Object.entries(collection).reverse()) {
        if (func(value, key, collection) == false) break;
      }
    }
    return collection;
  }
  const groupBy = (collection, func = identity) => {
    let res = {};
    func = iteratee(func);
    if (isArrayLikeObject(collection)) {
      collection.forEach(val => {
        let by = func(val);
        by in res ? res[by].push(val) : res[by] = [val];
      });
    } else {
      Object.keys(collection).forEach(key => {
        let by = func(collection[key]);
        by in res ? res[by].push(collection[key]) : res[by] = [collection[key]];
      });
    }
    return res;
  }
  const includes = (collection, value, fromIndex = 0) => {
    if (isArrayLike(collection)) {
      return collection.slice(fromIndex).some(item => sameValueZero(item, value));
    } else if (isString(collection)) {
      return collection.slice(fromIndex).includes(value);
    } else {
      return includes(Object.values(collection), value, fromIndex);
    }
  }
  // invokeMap = (collection, path, ...args) => {
    
  // }

  const reduce = (collection, func = identity, accumulator) => {
    func = iteratee(func);
    if (isArrayLikeObject(collection)) {
      for (let i = 0; i < collection.length; i++) {
        i == 0 && accumulator == undefined ? accumulator = collection[0] : accumulator = func(accumulator, collection[i], i, collection);
      }
    } else {
      for (let key in collection) {
        accumulator = func(accumulator, collection[key], key, collection);
      }
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
};