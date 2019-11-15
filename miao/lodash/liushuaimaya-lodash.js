// 非正常方法, 已废弃
// var liushuaimaya = (function() {
//   const src = liushuaimayaSrc.toString(); //获得liushuaimayaSrc函数源代码
//   const funcNames = src.match(/(?<=const )\b\w+\b(?= =)/g); //获得liushuaimayaSrc内所有函数名组成的字符串数组
//   const addReturnObj = `\nreturn {\n\t${funcNames.join(",\n\t")}\n}`; //将函数名join并拼接成需要返回对象的字符串
//   return new Function(src.slice(src.indexOf("{") + 1, -1) + addReturnObj); //返回拼接后的新函数
// })()();

var liushuaimaya = {
  chunk: (ary, size) =>
    ary
      .map((_, i) => (i % size ? null : ary.slice(i, i + size)))
      .filter(Boolean),
  compact: ary => ary.filter(Boolean),
  difference: (ary, ...args) => ary.filter(x => !args.flat().includes(x)),
  differenceBy(array, ...args) {
    const func = this.isString(args[args.length - 1])
      ? this.property(args.pop())
      : this.isFunction(args[args.length - 1])
      ? args.pop()
      : it => it;
    return array.filter(
      val =>
        !args
          .flat()
          .map(func)
          .includes(func(val)),
    );
  },
  differenceWith(array, ...args) {
    const comparator = this.isFunction(args[args.length - 1])
      ? args.pop()
      : it => it;
    return array.filter(arrVal =>
      args.flat().every(othVal => !comparator(arrVal, othVal)),
    );
  },
  drop: (arr, n = 1) => arr.slice(n),
  dropRight: (arr, n = 1) => arr.slice(0, n ? -n : arr.length),
  dropRightWhile(array, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    for (let i = array.length - 1; i < array.length; i--) {
      if (!predicate(array[i], i, array)) {
        return array.slice(0, i + 1);
      }
    }
  },
  dropWhile(array, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    for (let i = 0; i < array.length; i++) {
      if (!predicate(array[i], i, array)) {
        return array.slice(i);
      }
    }
  },
  fill: (array, value, start = 0, end = array.length) => {
    for (let i = start; i < end; i++) {
      array[i] = value;
    }
    return array;
  },
  findIndex(array, predicate = this.identity, fromIndex = 0) {
    predicate = this.iteratee(predicate);
    for (let i = fromIndex; i < array.length; i++) {
      if (predicate(array[i])) {
        return i;
      }
    }
    return -1;
  },
  findLastIndex(
    array,
    predicate = this.identity,
    fromIndex = array.length - 1,
  ) {
    predicate = this.iteratee(predicate);
    for (let i = fromIndex; i >= 0; i--) {
      if (predicate(array[i])) {
        return i;
      }
    }
    return -1;
  },
  flatten: ary => [].concat(...ary),
  flattenDeep(ary) {
    return ary.reduce(
      (res, it) => res.concat(Array.isArray(it) ? this.flattenDeep(it) : it),
      [],
    );
  },
  flattenDepth(ary, depth = 1) {
    return depth ? [].concat(...this.flattenDepth(ary, depth - 1)) : ary;
  },
  fromPairs: Object.fromEntries,
  head: array => array[0],
  indexOf(array, value, fromIndex = 0) {
    fromIndex += fromIndex < 0 ? array.length : 0;
    for (let i = fromIndex; i < array.length; i++) {
      if (this.sameValueZero(value, array[i])) {
        return i;
      }
    }
    return -1;
  },
  initial: array => array.slice(0, -1),
  intersection: (...arrays) =>
    arrays[0].filter(it => arrays.slice(1).every(array => array.includes(it))),
  intersectionBy(...args) {
    const transform = this.iteratee(args.pop());
    return args[0].filter(it =>
      args
        .slice(1)
        .every(array => array.some(val => transform(val) == transform(it))),
    );
  },
  intersectionWith(...args) {
    const comparator = this.iteratee(args.pop());
    return args[0].filter(arrVal =>
      args
        .slice(1)
        .every(array => array.some(othVal => comparator(othVal, arrVal))),
    );
  },
  join: (array, separator = ",") =>
    array.reduce((res, s) => "" + res + separator + s),
  last: array => array[array.length - 1],
  lastIndexOf(array, value, fromIndex = array.length - 1) {
    for (let i = fromIndex; i >= 0; i--) {
      if (this.sameValueZero(value, array[i])) {
        return i;
      }
    }
    return -1;
  },
  nth: (array, n = 0) => (n >= 0 ? array[n] : array[-n]),
  pull: (array, ...values) => {
    for (let i = 0; i < array.length; ) {
      values.includes(array[i]) ? array.splice(i, 1) : i++;
    }
    return array;
  },
  pullAll(array, values) {
    return this.pull(array, ...values);
  },
  pullAllBy(array, values, func = this.identity) {
    func = this.iteratee(func);
    values = values.map(func);
    for (let i = 0; i < array.length; ) {
      values.includes(func(array[i])) ? array.splice(i, 1) : i++;
    }
    return array;
  },
  pullAllWith: (array, values, comparator) => {
    for (let i = 0; i < array.length; ) {
      values.some(othVal => comparator(array[i], othVal))
        ? array.splice(i, 1)
        : i++;
    }
    return array;
  },
  reverse: array => array.reverse(),
  sortedIndex: (array, value) => {
    let l = 0,
      r = array.length - 1;
    while (l <= r) {
      let mid = ((l + r) / 2) | 0;
      array[mid] < value ? (l = mid + 1) : (r = mid - 1);
    }
    return l;
  },
  sortedIndexBy(array, value, func = this.identity) {
    func = this.iteratee(func);
    return this.sortedIndex(array.map(func), func(value));
  },
  sortedIndexOf(array, value) {
    return array[(index = this.sortedIndex(array, value))] === value
      ? index
      : -1;
  },
  sortedLastIndex: (array, value) => {
    let l = 0,
      r = array.length - 1;
    while (l <= r) {
      let mid = ((l + r) / 2) | 0;
      array[mid] <= value ? (l = mid + 1) : (r = mid - 1);
    }
    return l;
  },
  sortedLastIndexBy(array, value, func = this.identity) {
    func = this.iteratee(func);
    return this.sortedLastIndex(array.map(func), func(value));
  },
  sortedLastIndexOf(array, value) {
    return array[(index = this.sortedLastIndex(array, value) - 1)] === value
      ? index
      : -1;
  },
  sortedUniq: array => [...new Set(array)],
  sortedUniqBy(array, func) {
    func = this.iteratee(func);
    return array.reduce(
      (res, it) =>
        func(it) !== func(res[res.length - 1]) ? [...res, it] : res,
      [],
    );
  },
  tail: array => array.slice(1),
  take: (array, n = 1) => array.slice(0, n),
  takeRight: (array, n = 1) => array.slice(n ? -n : array.length),
  takeRightWhile(array, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    for (let i = array.length - 1; i >= 0; i--) {
      if (!predicate(array[i], i, array)) {
        return array.slice(i + 1);
      }
    }
  },
  takeWhile(array, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    for (let i = 0; i < array.length; i++) {
      if (!predicate(array[i], i, array)) {
        return array.slice(0, i);
      }
    }
  },
  union: (...arrays) => [...new Set(arrays.flat())],
  unionBy(...arrays) {
    func = this.iteratee(arrays.pop());
    const transformed = arrays.flat().map(func);
    return arrays
      .flat()
      .filter((_, i) => transformed.indexOf(transformed[i]) == i);
  },
  unionWith: (...arrays) => {
    const array = arrays.flat();
    const comparator = array.pop();
    return array.filter(
      (arrVal, i) =>
        !array.slice(0, i).some(othVal => comparator(arrVal, othVal)),
    );
  },
  uniq: array => [...new Set(array)],
  uniqBy(array, func) {
    func = this.iteratee(func);
    const transformed = array.map(func);
    return array.filter((_, i) => transformed.indexOf(transformed[i]) == i);
  },
  uniqWith: (array, comparator) =>
    array.filter(
      (arrVal, i) =>
        !array.slice(0, i).some(othVal => comparator(arrVal, othVal)),
    ),
  unzip(array) {
    return this.zip(...array);
  },
  unzipWith(array, func) {
    func = this.iteratee(func);
    return array[0].map((_, i) => func(...array.map(it => it[i])));
  },
  without: (array, ...values) => array.filter(it => !values.includes(it)),
  xor: (...arrays) =>
    arrays
      .flat()
      .filter((it, _, arr) => arr.indexOf(it) == arr.lastIndexOf(it)),
  xorBy(...args) {
    const arr = args.flat();
    predicate = this.iteratee(arr.pop());
    const transformed = arr.map(predicate);
    return arr.filter(
      (_, i) =>
        transformed.indexOf(transformed[i]) ==
        transformed.lastIndexOf(transformed[i]),
    );
  },
  xorWith: (...args) => {
    const comparator = args.pop();
    return args
      .flat()
      .filter((val, i, arr) =>
        [...arr.slice(0, i), ...arr.slice(i + 1)].every(
          othVal => !comparator(val, othVal),
        ),
      );
  },
  zip: (...arrays) =>
    Array(Math.max(...arrays.map(it => it.length)))
      .fill(0)
      .map((_, i) => arrays.map(ary => ary[i])),
  zipObject: (props = [], values = []) =>
    props.reduce((obj, prop, i) => ((obj[prop] = values[i]), obj), {}),
  zipObjectDeep(props = [], values = []) {
    const res = isNaN(+props[0][0]) ? {} : [];
    for (let i = 0; i < props.length; i++) {
      const path = this.toPath(props[i]);
      let cur = res;
      for (let j = 0; j < path.length - 1; j++) {
        if (!(path[j] in cur)) {
          cur[path[j]] = isNaN(+path[j + 1]) ? {} : [];
        }
        cur = cur[path[j]];
      }
      cur[path[path.length - 1]] = values[i];
    }
    return res;
  },
  zipWith(...args) {
    const func = this.iteratee(args.pop());
    return args[0].map((_, i) => func(...args.map(it => it[i])));
  },
  countBy(collection, func = this.identity) {
    func = this.iteratee(func);
    return Object.values(collection)
      .map(func)
      .reduce((res, it) => (it in res ? res[it]++ : (res[it] = 1), res), {});
  },
  every(collection, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    return this.isArrayLikeObject(collection)
      ? collection.reduce(
          (res, value, index) => res && predicate(value, index, collection),
          true,
        )
      : Object.keys(collection).reduce(
          (res, key) => res && predicate(collection[key], key, collection),
          true,
        );
  },
  filter(collection, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    return this.isArrayLikeObject(collection)
      ? collection.reduce(
          (res, value, index) =>
            predicate(value, index, collection) ? [...res, value] : res,
          [],
        )
      : Object.keys(collection).reduce(
          (res, key) =>
            predicate(collection[key], key, collection) ? [...res, value] : res,
          [],
        );
  },
  find(collection, predicate = this.identity, fromIndex = 0) {
    predicate = this.iteratee(predicate);
    if (Array.isArray(collection)) {
      for (let index = fromIndex; index < collection.length; index++) {
        if (predicate(collection[index], index, collection)) {
          return collection[index];
        }
      }
    } else {
      for (const key in collection) {
        if (predicate(collection[key], key, collection)) {
          return collection[key];
        }
      }
    }
    return undefined;
  },
  findLast(collection, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    const arr = Array.from(collection.entries()).reverse();
    return arr[
      arr.findIndex(pair => predicate(pair[1], pair[0], collection))
    ][1];
  },
  flatMap(collection, func = this.identity) {
    return collection.flatMap(func);
  },
  flatMapDeep(collection, func = this.identity) {
    return this.flattenDeep(this.map(collection, func));
  },
  flatMapDepth(collection, func = this.identity, n) {
    return this.flattenDepth(this.map(collection, func), n);
  },
  forEach(collection, func = this.identity) {
    func = this.iteratee(func);
    if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
        if (func(collection[i], i, collection) === false) break;
      }
    } else {
      this.forIn(collection, func);
    }
    return collection;
  },
  forEachRight(collection, func = this.identity) {
    func = this.iteratee(func);
    if (Array.isArray(collection)) {
      for (let index = collection.length - 1; index >= 0; index--) {
        if (func(collection[index], index, collection) === false) break;
      }
    } else {
      for (const [key, value] of Object.entries(collection).reverse()) {
        if (func(value, key, collection) == false) break;
      }
    }
    return collection;
  },
  groupBy(collection, func = this.identity) {
    const res = {};
    func = this.iteratee(func);
    if (Array.isArray(collection)) {
      collection.forEach(val => {
        const by = func(val);
        by in res ? res[by].push(val) : (res[by] = [val]);
      });
    } else {
      Object.keys(collection).forEach(key => {
        const by = func(collection[key]);
        by in res
          ? res[by].push(collection[key])
          : (res[by] = [collection[key]]);
      });
    }
    return res;
  },
  includes(collection, value, fromIndex = 0) {
    if (Array.isArray(collection)) {
      return collection
        .slice(fromIndex)
        .some(item => this.sameValueZero(item, value));
    } else if (this.isString(collection)) {
      return collection.slice(fromIndex).includes(value);
    } else {
      return this.includes(Object.values(collection), value, fromIndex);
    }
  },
  invokeMap(collection, path, ...args) {
    if (typeof path === "string") {
      return collection.map(it => it[path](...args));
    } else if (typeof path === "function") {
      return collection.map(it => path.apply(it, args));
    } else {
      return collection.map(it => this.property(path)(it).apply(it, args));
    }
  },
  map(collection, func = this.identity) {
    func = this.iteratee(func);
    if (Array.isArray(collection)) {
      return collection.map((value, index) => func(value, index, collection));
    } else {
      return Object.keys(collection).map(key =>
        func(collection[key], key, collection),
      );
    }
  },
  orderBy(collection, funcs = [this.identity], orders) {
    funcs = funcs.map(it => this.iteratee(it));
    const compare = (a, b, funcs, orders) => {
      for (let i = 0; i < funcs.length; i++) {
        const flag = orders[i] === "asc" ? 1 : -1;
        if (funcs[i](a) < funcs[i](b)) return -flag;
        if (funcs[i](a) > funcs[i](b)) return flag;
      }
      return 0;
    };
    return collection.sort((a, b) => compare(a, b, funcs, orders));
  },
  partition(collection, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    return collection.reduce(
      (res, it) => {
        res[predicate(it) ? 0 : 1].push(it);
        return res;
      },
      [[], []],
    );
  },
  reduce(collection, func = this.identity, accumulator) {
    func = this.iteratee(func);
    if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
        i == 0 && accumulator == undefined
          ? (accumulator = collection[0])
          : (accumulator = func(accumulator, collection[i], i, collection));
      }
    } else {
      for (const key in collection) {
        accumulator = func(accumulator, collection[key], key, collection);
      }
    }
    return accumulator;
  },
  reduceRight(collection, func = this.identity, accumulator) {
    func = this.iteratee(func);
    for (let i = collection.length - 1; i >= 0; i--) {
      accumulator = func(accumulator, collection[i], i, collection);
    }
    return accumulator;
  },
  reject(collection, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    return collection.filter((it, i, arr) => !predicate(it, i, arr));
  },
  sample(collection) {
    return collection[Math.floor(Math.random() * collection.length)];
  },
  sampleSize(collection, n = 1) {
    return collection.sort(() => Math.random() - 0.5).slice(0, n);
  },
  shuffle(collection) {
    return collection.sort(() => Math.random() - 1);
  },
  size: collection => collection.length || Object.keys(collection).length,
  some(collection, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    return this.isArrayLikeObject(collection)
      ? collection.reduce(
          (res, value, index) => res || predicate(value, index, collection),
          false,
        )
      : Object.keys(collection).reduce(
          (res, key) => res || predicate(collection[key], key, collection),
          false,
        );
  },
  sortBy(collection, funcs = [this.identity]) {
    funcs = funcs.map(it => this.iteratee(it));
    const compare = (a, b, funcs) => {
      for (let i = 0; i < funcs.length; i++) {
        if (funcs[i](a) < funcs[i](b)) return -1;
        if (funcs[i](a) > funcs[i](b)) return 1;
      }
      return 0;
    };
    return collection.sort((a, b) => compare(a, b, funcs));
  },
  defer: (func, ...args) => setTimeout(() => func(args), 0),
  delay: (func, wait, ...args) => setTimeout(() => func(...args), wait),
  castArray: (...args) => (Array.isArray(...args) ? args[0] : args),
  conformsTo: (object, source) =>
    Object.values(source).every((func, i) =>
      func(object[Object.keys(source)[i]]),
    ),
  eq(a, b) {
    return this.sameValueZero(a, b);
  },
  gt: (value, other) => value > other,
  gte: (value, other) => value >= other,
  isArguments(value) {
    return this.getTag("Arguments")(value);
  },
  isArray: Array.isArray,
  isArrayBuffer(value) {
    return this.getTag("ArrayBuffer")(value);
  },
  isArrayLike(value) {
    return (
      !this.isFunction(value) &&
      !this.isString(value) &&
      value !== undefined &&
      value !== null &&
      value.length >= 0 &&
      value.length <= Number.MAX_SAFE_INTEGER
    );
  },
  isArrayLikeObject(value) {
    return this.isArrayLike(value) && this.isObject(value);
  },
  isBoolean(value) {
    return this.getTag("Boolean")(value);
  },
  isDate(value) {
    return this.getTag("Date")(value);
  },
  isElement: value => value instanceof Element,
  isEmpty(value) {
    if (
      this.isArguments(value) ||
      this.isArray(value) ||
      this.isString(value) ||
      this.isFunction(value)
    ) {
      return !value.length;
    }
    if (this.isMap(value) || this.isSet(value)) return !value.size;
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) return false;
    }
    return true;
  },
  isEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null || typeof a != "object" || typeof b != "object")
      return false;
    const keysA = Object.keys(a),
      keysB = Object.keys(b);
    if (keysA.length != keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !this.isEqual(a[key], b[key])) return false;
    }
    return true;
  },
  isEqualWith(a, b, customizer) {
    if (customizer(a, b) || a === b) return true;
    if (a == null || b == null || typeof a != "object" || typeof b != "object")
      return false;
    const keysA = Object.keys(a),
      keysB = Object.keys(b);
    if (keysA.length != keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (
        !customizer(a[key], b[key], key, a, b) &&
        !this.isEqualWith(a[key], b[key], customizer)
      )
        return false;
    }
    return true;
  },
  isError(value) {
    return this.getTag("Error")(value);
  },
  isFinite: Number.isFinite,
  isFunction(value) {
    return this.getTag("Function")(value);
  },
  isInteger: Number.isInteger,
  isLength(value) {
    return value === this.toLength(value);
  },
  isMap(value) {
    return this.getTag("Map")(value);
  },
  isMatch(obj, src) {
    if (obj === src) return true;
    if (obj == null || typeof obj != "object" || typeof src != "object")
      return false;
    const keysObj = Object.keys(obj),
      keysSrc = Object.keys(src);
    for (const key of keysSrc) {
      if (!keysObj.includes(key) || !this.isMatch(obj[key], src[key]))
        return false;
    }
    return true;
  },
  isMatchWith: (a, b, customizer) => {
    if (customizer(a, b) || a === b) return true;
    if (a == null || b == null || typeof a != "object" || typeof b != "object")
      return false;
    const keysA = Object.keys(a),
      keysB = Object.keys(b);
    for (const key of keysB) {
      if (!keysA.includes(key)) return false;
      if (
        !customizer(a[key], b[key], key, a, b) &&
        !this.isMatchWith(a[key], b[key], customizer)
      )
        return false;
    }
    return true;
  },
  isNaN(value) {
    return this.isNumber(value) && +value !== value;
  },
  isNative: func => func.toString().includes("[native code]"),
  isNil: value => value === undefined || value === null,
  isNull: value => value === null,
  isNumber(value) {
    return this.getTag("Number")(value);
  },
  isObject: value => value instanceof Object,
  isObjectLike: value => typeof value === "object" && value !== null,
  isPlainObject: value =>
    Object.getPrototypeOf(value) === Object.prototype ||
    Object.getPrototypeOf(value) === null,
  isRegExp(value) {
    return this.getTag("RegExp")(value);
  },
  isSafeInteger: Number.isSafeInteger,
  isSet(value) {
    return this.getTag("Set")(value);
  },
  isString(value) {
    return this.getTag("String")(value);
  },
  isSymbol: value => typeof value === "symbol",
  isTypedArray(value) {
    return /^(Int|Uint|Float)(8|16|32|64)(Clamped)?Array$/.test(
      Object.prototype.toString.call(value).slice(8, -1),
    );
  },
  isUndefined(value) {
    return this.getTag("Undefined")(value);
  },
  isWeakMap(value) {
    return this.getTag("WeakMap")(value);
  },
  isWeakSet(value) {
    return this.getTag("WeakSet")(value);
  },
  lt: (value, other) => value < other,
  lte: (value, other) => value <= other,
  toArray(value) {
    return this.isObject(value)
      ? Object.entries(value).map(it => it[1])
      : this.isString(value)
      ? value.split("")
      : [];
  },
  toFinite: value => {
    value = Number(value);
    if (value === Infinity) return Number.MAX_VALUE;
    if (value === -Infinity) return -Number.MAX_VALUE;
    return value;
  },
  toInteger(value) {
    value = Number(value);
    if (isNaN(value) || value === 0) return 0;
    if (value === Infinity) return Number.MAX_VALUE;
    if (value === -Infinity) return -Number.MAX_VALUE;
    return Math.floor(Math.abs(value)) * (value < 0 ? -1 : 1);
  },
  toLength(value) {
    const len = this.toInteger(value);
    if (len < 0) return 0;
    return Math.min(len, 2 ** 32 - 1);
  },
  toNumber: Number,
  assign: Object.assign,
  toSafeInteger: value => {
    value = Number(value);
    if (isNaN(value) || value === 0) return 0;
    value = Math.min(Number.MAX_SAFE_INTEGER, value);
    value = Math.max(Number.MIN_SAFE_INTEGER, value);
    return Math.floor(Math.abs(value)) * (value < 0 ? -1 : 1);
  },
  add: (a, b) => a + b,
  ceil: (value, p = 0) => Math.ceil(value * 10 ** p) / 10 ** p,
  divide: (dividend, divisor) => dividend / divisor,
  floor: (value, p = 0) => Math.floor(value * 10 ** p) / 10 ** p,
  max: array => (array && array.length ? Math.max(...array) : undefined),
  maxBy(array, func = this.identity) {
    func = this.iteratee(func);
    return array.map(it => [func(it), it]).sort((a, b) => b[0] - a[0])[0][1];
  },
  mean: array => array.reduce((a, b) => a + b) / array.length,
  meanBy(array, func = this.identity) {
    func = this.iteratee(func);
    return this.mean(array.map(func));
  },
  min: array => (array && array.length ? Math.min(...array) : undefined),
  minBy(array, func = this.identity) {
    func = this.iteratee(func);
    return array.map(it => [func(it), it]).sort((a, b) => a[0] - b[0])[0][1];
  },
  multiply: (multiplier, multiplicand) => multiplier * multiplicand,
  round: (value, p = 0) => Math.round(value * 10 ** p) / 10 ** p,
  subtract: (minuend, subtrahend) => minuend - subtrahend,
  sum: array => array.reduce((a, b) => a + b),
  sumBy(array, func = this.identity) {
    func = this.iteratee(func);
    return array.map(func).reduce((a, b) => a + b);
  },
  clamp: (number, ...args) => {
    if (args.length === 2) {
      number = Math.max(args[0], number);
      number = Math.min(args[1], number);
    } else {
      number = Math.min(args[0], number);
    }
    return number;
  },
  inRange: (number, ...args) => {
    if (args.length === 2) {
      if (args[0] > args[1]) [args[0], args[1]] = [args[1], args[0]];
      return number > args[0] && number < args[1];
    }
    return number > 0 && number < args[0];
  },
  random(...args) {
    let lower = 0,
      upper = 1,
      floating;
    if (typeof args[args.length - 1] === "boolean") {
      floating = args.pop();
    } else {
      floating = args.some(n => !Number.isInteger(n));
    }
    if (args.length === 2) {
      lower = args[0];
      upper = args[1];
    } else if (args.length === 1) {
      upper = args[0];
    }
    if (!floating) {
      lower = Math.ceil(lower);
      upper = Math.floor(upper);
      return lower + Math.floor(Math.random() * (upper - lower + 1));
    } else {
      return lower + Math.random() * (upper - lower);
    }
  },
  assignIn: (object, ...sources) => {
    sources.forEach(src => {
      for (const key in src) {
        object[key] = src[key];
      }
    });
    return object;
  },
  at(object, paths) {
    return paths.map(path => this.property(path)(object));
  },
  defaults: (object, ...sources) => {
    sources.forEach(src => {
      for (const key in src) {
        if (object[key] === undefined) object[key] = src[key];
      }
    });
    return object;
  },
  defaultsDeep(object, ...sources) {
    sources.forEach(src => {
      for (const key in src) {
        if (object[key] === undefined) object[key] = src[key];
        else if (
          typeof object[key] === "object" &&
          typeof src[key] === "object" &&
          typeof object[key] !== null &&
          typeof src[key] !== null
        ) {
          this.defaultsDeep(object[key], src[key]);
        }
      }
    });
    return object;
  },
  findKey(object, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    for (const key in object) {
      if (predicate(object[key], key, object)) {
        return key;
      }
    }
  },
  findLastKey(object, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    for (const key of Object.keys(object).reverse()) {
      if (predicate(object[key], key, object)) {
        return key;
      }
    }
  },
  forIn(obj, func = this.identity) {
    func = this.iteratee(func);
    for (const key in obj) {
      if (func(obj[key], key, obj) === false) {
        break;
      }
    }
    return obj;
  },
  forInRight(obj, func = this.identity) {
    func = this.iteratee(func);
    const keys = [];
    for (const key in obj) {
      keys.push(key);
    }
    for (const key of keys.reverse()) {
      if (func(obj[key], key, obj) === false) {
        break;
      }
    }
    return obj;
  },
  forOwn(object, func = this.identity) {
    func = this.iteratee(func);
    Object.keys(object).forEach(key => func(object[key], key, object));
    return object;
  },
  forOwnRight(object, func = this.identity) {
    func = this.iteratee(func);
    Object.keys(object)
      .reverse()
      .forEach(key => func(object[key], key, object));
    return object;
  },
  functions(object) {
    return Object.keys(object).filter(key => typeof object[key] === "function");
  },
  functionsIn(object) {
    const res = [];
    for (const key in object) {
      if (typeof object[key] === "function") res.push(key);
    }
    return res;
  },
  get(object, path, defaultValue) {
    try {
      const res = this.property(path)(object);
      return res === undefined ? defaultValue : res;
    } catch (e) {
      return defaultValue;
    }
  },
  has(object, path) {
    path = this.toPath(path);
    for (const key of path) {
      if (!object.hasOwnProperty(key)) {
        return false;
      }
      object = object[key];
    }
    return true;
  },
  hasIn(object, path) {
    path = this.toPath(path);
    for (const key of path) {
      if (!(key in object)) {
        return false;
      }
      object = object[key];
    }
    return true;
  },
  invert(object) {
    return Object.fromEntries(Object.entries(object).map(it => it.reverse()));
  },
  invertBy(object, func = this.identity) {
    return Object.keys(object).reduce((res, key) => {
      const cur = func(object[key]);
      cur in res ? res[cur].push(key) : (res[cur] = [key]);
      return res;
    }, {});
  },
  invoke(object, path, ...args) {
    path = this.toPath(path);
    const func = path.pop();
    return this.property(path)(object)[func](...args);
  },
  keys: Object.keys,
  keysIn(object) {
    const res = [];
    for (const key in object) {
      res.push(key);
    }
    return res;
  },
  mapKeys(object, func = this.identity) {
    func = this.iteratee(func);
    return Object.entries(object).reduce((res, [key, value]) => {
      res[func(value, key, object)] = value;
      return res;
    }, {});
  },
  mapValues(object, func = this.identity) {
    func = this.iteratee(func);
    return Object.entries(object).reduce((res, [key, value]) => {
      res[key] = func(value, key, object);
      return res;
    }, {});
  },
  merge(obj, ...sources) {
    sources.forEach(src => {
      for (const key in src) {
        if (!(key in obj)) {
          obj[key] = src[key];
        } else if (
          key in obj &&
          typeof src[key] === "object" &&
          typeof obj[key] === "object" &&
          src[key] !== null &&
          obj[key] !== null
        ) {
          this.merge(obj[key], src[key]);
        }
      }
    });
    return obj;
  },
  mergeWith(obj, ...args) {
    const customizer = args.pop();
    args.forEach(src => {
      for (const key in src) {
        if (!(key in obj)) {
          obj[key] = src[key];
        } else if (
          key in obj &&
          typeof src[key] === "object" &&
          typeof obj[key] === "object" &&
          src[key] !== null &&
          obj[key] !== null
        ) {
          const res = customizer(obj[key], src[key], key, obj, src);
          if (res === undefined) {
            this.merge(obj[key], src[key]);
          } else {
            obj[key] = res;
          }
        }
      }
    });
    return obj;
  },
  omit(object, paths) {
    const res = {};
    for (const key in object) {
      if (!paths.includes(key)) {
        res[key] = object[key];
      }
    }
    return res;
  },
  omitBy(object, predicate = this.identity) {
    const res = {};
    for (const key in object) {
      if (!predicate(object[key], key)) {
        res[key] = object[key];
      }
    }
    return res;
  },
  pick(object, paths) {
    const res = {};
    for (const key in object) {
      if (paths.includes(key)) {
        res[key] = object[key];
      }
    }
    return res;
  },
  pickBy(object, predicate = this.identity) {
    const res = {};
    for (const key in object) {
      if (predicate(object[key], key)) {
        res[key] = object[key];
      }
    }
    return res;
  },
  result(object, path, defaultValue) {
    path = this.toPath(path);
    let last = null,
      res = object;
    for (const prop of path) {
      last = res;
      res = res[prop];
      if (res === undefined) {
        return typeof defaultValue === "function"
          ? defaultValue()
          : defaultValue;
      }
    }
    return typeof res === "function" ? res.call(last) : res;
  },
  set(object, path, value) {
    path = this.toPath(path);
    path.reduce((res, p, i) => {
      if (i === path.length - 1) {
        res[p] = value;
      } else if (
        path[i + 1].charCodeAt(0) >= 48 &&
        path[i + 1].charCodeAt(0) <= 57
      ) {
        res[p] = [];
      } else {
        res[p] = {};
      }
      return res[p];
    }, object);
    return object;
  },
  setWith(object, path, value, customizer) {
    if (!customizer) return this.set(object, path, value);
    path = this.toPath(path);
    path.reduce((res, p, i) => {
      if (i === path.length - 1) {
        res[p] = value;
      } else if (customizer() !== undefined) {
        res[p] = customizer();
      } else if (
        path[i + 1].charCodeAt(0) >= 48 &&
        path[i + 1].charCodeAt(0) <= 57
      ) {
        res[p] = [];
      } else {
        res[p] = {};
      }
      return res[p];
    }, object);
    return object;
  },
  toPairs: Object.entries,
  toPairsIn: object => {
    const res = [];
    for (const key in object) {
      res.push([key, object[key]]);
    }
    return res;
  },
  transform(
    obj,
    func = this.identity,
    accumulator = Object.create(Object.getPrototypeOf(obj)),
  ) {
    for (const key in obj) {
      if (func(accumulator, obj[key], key) === false) break;
    }
    return accumulator;
  },
  unset(object, path) {
    path = this.toPath(path);
    if (this.has(object, path)) {
      delete this.get(object, path.slice(0, -1))[path[path.length - 1]];
    }
    return !this.has(object, path);
  },
  update(object, path, updater) {
    return this.set(object, path, updater(this.get(object, path)));
  },
  updateWith(object, path, updater, customizer) {
    const value = this.get(object, path);
    return this.setWith(object, path, updater(value), customizer);
  },
  values: Object.values,
  valuesIn(object) {
    const res = [];
    for (const key in object) {
      res.push(object[key]);
    }
    return res;
  },
  camelCase(str) {
    const words = str.match(/[^\W_]+/g);
    return words
      .map((w, i) => (i ? this.capitalize(w) : w.toLowerCase()))
      .join("");
  },
  capitalize: (string = "") =>
    string[0].toUpperCase() + string.slice(1).toLowerCase(),
  endsWith(string = "", target, position = string.length) {
    return string.slice(position - target.length, position) === target;
  },
  escape(str = "") {
    const entities = [
      ["amp", "&"],
      ["lt", "<"],
      ["gt", ">"],
      ["quot", '"'],
      ["apos", '"'],
    ];
    return entities.reduce((res, [en, c]) => res.replace(c, `&${en};`), str);
  },
  escapeRegExp(string = "") {
    const reg = /[\^\$\,\.\*\+\?\(\)\[\]\{\}\|]/g;
    return string.replace(reg, `\\$&`);
  },
  kebabCase(str) {
    return this.words(str)
      .map(w => w.toLowerCase())
      .join("-");
  },
  lowerFirst: str => str[0].toLowerCase() + str.slice(1),
  lowerCase(str) {
    return this.words(str)
      .join(" ")
      .toLowerCase();
  },
  words(str = "", pattern) {
    return str.match(pattern || /[A-Za-z][a-z]+|[A-Z]+/g);
  },
  pad: (string = "", length = 0, chars = " ") => {
    const padLength = length - string.length;
    const add = chars
      .repeat(Math.ceil(padLength / chars.length))
      .slice(0, padLength);
    const left = add.slice(0, Math.floor(add.length / 2));
    const right = add.slice(Math.floor(add.length / 2));
    return left + string + right;
  },
  padEnd: (string = "", length = 0, chars = " ") => {
    return (
      string + chars.repeat(Math.ceil((length - string.length) / chars.length))
    ).slice(0, length);
  },
  padStart: (string = "", length = 0, chars = " ") => {
    const padLength = length - string.length;
    return (
      chars.repeat(Math.ceil(padLength / chars.length)).slice(0, padLength) +
      string
    );
  },
  parseInt(string, radix) {
    if (!radix && string.slice(0, 2) === "0x") radix = 16;
    else if (arguments.length === 3 || !radix) radix = 10;
    return parseInt(string, radix);
  },
  repeat: (str, n = 1) => str.repeat(n),
  replace: (str, pat, rep) => str.replace(pat, rep),
  snakeCase(str = "") {
    return this.words(str)
      .join("_")
      .toLowerCase();
  },
  split(str, sep, lim) {
    return str.split(sep, lim);
  },
  startCase(str = "") {
    return this.words(str)
      .map(s => this.upperFirst(s))
      .join(" ");
  },
  startsWith(string = "", target, position = 0) {
    return string.slice(position, position + target.length) === target;
  },
  upperFirst(str = "") {
    return str[0].toUpperCase() + str.slice(1);
  },
  toLower: (str = "") => str.toLowerCase(),
  toUpper: (str = "") => str.toUpperCase(),
  trim(str = "", chars = "  ") {
    if (arguments.length === 3) chars = "  ";
    str = this.trimEnd(str, chars);
    return this.trimStart(str, chars);
  },
  trimEnd(str = "", chars = "  ") {
    for (let i = str.length - 1; i >= 0; i--) {
      if (!chars.includes(str[i])) {
        str = str.slice(0, i + 1);
        break;
      }
    }
    return str;
  },
  trimStart(str = "", chars = "  ") {
    for (let i = 0; i < str.length; i++) {
      if (!chars.includes(str[i])) {
        str = str.slice(i);
        break;
      }
    }
    return str;
  },
  truncate(str = "", op = {}) {
    if (!op.length) op.length = 30;
    if (!op.omission) op.omission = "...";
    str = str.slice(0, op.length - op.omission.length);
    if (this.isRegExp(op.separator) && !op.separator.global)
      op.separator = new RegExp(op.separator, op.separator.flags + "g");
    const index = [...str.matchAll(op.separator)].pop().index;
    return str.slice(0, index) + op.omission;
  },
  unescape(str = "") {
    const entities = [
      ["amp", "&"],
      ["lt", "<"],
      ["gt", ">"],
      ["quot", '"'],
      ["apos", '"'],
    ];
    return entities.reduce((res, [en, c]) => res.replace(`&${en};`, c), str);
  },
  upperCase(str) {
    return this.words(str)
      .join(" ")
      .toUpperCase();
  },
  bindAll(object, methodNames) {
    methodNames.forEach(m => {object[m] = object[m].bind(object)});
    return object;
  },
  defaultTo(val, defaultVal) {
    return Number.isNaN(val) || val === undefined || val === null
      ? defaultVal
      : val;
  },
  range(start = 0, end, step) {
    if (end === undefined) {
      end = start;
      start = 0;
    }
    if (step === undefined) {
      step = end < 0 ? -1 : 1;
    }
    if (step === 0) {
      return Array(Math.ceil(end - start)).fill(start);
    }
    const res = [];
    for (let i = start; (i - start) * (end - i) >= 0 && i !== end; i += step) {
      res.push(i);
    }
    return res;
  },
  rangeRight(...args) {
    return this.range(...args).reverse();
  },
  mixin(obj = liushuaimaya, src, op = {}) {
    if (op.chain === undefined) op.chain = true;
  },
  times(n, func = this.identity) {
    const res = [];
    for (let i = 0; i < n; i++) {
      res.push(func(i));
    }
    return res;
  },
  toPath(path) {
    return this.isString(path) ? path.match(/\w+/g) : path;
  },
  _base: 2,
  uniqueId(prefix = "") {
    this._base++;
    return prefix + this._base;
  },
  cloneDeep(value) {
    if(typeof value !== "object" || typeof value === null || this.isRegExp(value)) {
      return value;
    }
    const res = Array.isArray(value) ? [] : {};
    for(const key in value) {
      res[key] = this.cloneDeep(value[key]);
    }
    return res;
  },
  identity: (...args) => args[0],
  concat(arr, ...vals){
    return [...arr, ...vals.flat()];
  },
  pullAt: (array, indexes) =>
  indexes
    .sort((a, b) => b - a)
    .reduce((res, i) => [...array.splice(i, 1), ...res], []),
  matches(src) {
    return obj => this.isMatch(obj, src);
  },
  property(path) {
    return obj => this.toPath(path).reduce((res, it) => res[it], obj);
  },
  ary(func, n = func.length) {
    return function(...args) {
      return func.apply(this, args.slice(0, n));
    };
  },
  unary(func) {
    return function(...args) {
      return func.apply(this, args[0]);
    };
  },
  negate: f => (...args) => !f(...args),
  once(func) {
    let res;
    let isExecuted = false;
    return function(...args) {
      if (!isExecuted) {
        res = func.apply(this, args);
        isExecuted = true;
      }
      return res;
    };
  },
  spread: f => args => f(...args),

  getTag: tag => value =>
    Object.prototype.toString.call(value).slice(8, -1) === tag,
  constant: value => () => value,
  sameValueZero(x, y) {
    if (typeof x != typeof y) return false;
    if (this.isNumber(x)) {
      if (isNaN(x) && isNaN(y)) return true;
      if (x === +0 && y === -0) return true;
      if (x === -0 && y === +0) return true;
      if (x === y) return true;
    }
    return x === y;
  },

  matchesProperty(path, srcValue) {
    return obj => this.isMatch(this.property(path)(obj), srcValue);
  },
  iteratee(func = this.identity) {
    if (this.isRegExp(func)) return str => func.test(str);
    if (this.isFunction(func)) return func;
    if (this.isArray(func)) return this.matchesProperty(func[0], func[1]);
    if (this.isString(func)) return this.property(func);
    if (this.isObject(func)) return this.matches(func);
  },



  flip: f => (...args) => f(...args.reverse()),

  keyBy(collection, func = this.identity) {
    return collection.reduce((res, obj) => (res[func(obj)] = obj && res), {});
  },

  // memoize: f => (
  //   (memo = {}),
  //   (...args) => (args in memo ? memo[args] : (memo[args] = f(...args))
  // ,
  
  any: (f, n = f.length) => (...args) => f(...args.slice(0, n)),
  bind: (f, ...args1) => (...args2) => f(...args1, ...args2),
};

// 将所有函数的this绑定到liushuaimaya对象
// (() =>
//   Object.keys(liushuaimaya).forEach(
//     key => (liushuaimaya[key] = liushuaimaya[key].bind(liushuaimaya)),
//   ))();
((...funcs) => {
  const me = liushuaimaya;
  funcs.forEach(f => (me[f] = me[f].bind(me)));
})("trim");
