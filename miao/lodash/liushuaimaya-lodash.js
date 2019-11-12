// 非正常方法, 已废弃
// var liushuaimaya = (function() {
//   const src = liushuaimayaSrc.toString(); //获得liushuaimayaSrc函数源代码
//   const funcNames = src.match(/(?<=const )\b\w+\b(?= =)/g); //获得liushuaimayaSrc内所有函数名组成的字符串数组
//   const addReturnObj = `\nreturn {\n\t${funcNames.join(",\n\t")}\n}`; //将函数名join并拼接成需要返回对象的字符串
//   return new Function(src.slice(src.indexOf("{") + 1, -1) + addReturnObj); //返回拼接后的新函数
// })()();

var liushuaimaya = {
  getTag: tag => value =>
    Object.prototype.toString.call(value).slice(8, -1) === tag,
  isString(value) {
    return this.getTag("String")(value);
  },
  isArguments(value) {
    return this.getTag("Arguments")(value);
  },
  isBoolean(value) {
    return this.getTag("Boolean")(value);
  },
  isDate(value) {
    return this.getTag("Date")(value);
  },
  isSet(value) {
    return this.getTag("Set")(value);
  },
  isMap(value) {
    return this.getTag("Map")(value);
  },
  isError(value) {
    return this.getTag("Error")(value);
  },
  isFunction(value) {
    return this.getTag("Function")(value);
  },
  isNumber(value) {
    return this.getTag("Number")(value);
  },
  isRegExp(value) {
    return this.getTag("RegExp")(value);
  },
  isUndefined(value) {
    return this.getTag("Undefined")(value);
  },
  isNaN(value) {
    return this.isNumber(value) && +value !== value;
  },
  isObject: value => value instanceof Object,
  isElement: value => value instanceof Element,
  isNull: value => value === null,
  isNil: value => value === undefined || value === null,
  isFinite: Number.isFinite,
  isArray: Array.isArray,
  toArray(value) {
    return this.isObject(value)
      ? Object.entries(value).map(it => it[1])
      : this.isString(value)
      ? value.split("")
      : [];
  },
  add: (a, b) => a + b,
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
  sameValueZero(x, y) {
    if (typeof x != typeof y) return false;
    if (this.isNumber(x)) {
      if (isNaN(x) && isNaN(y)) return true;
      if (x === +0 && y === -0) return true;
      if (x === -0 && y === +0) return true;
      if (x === y) return true;
    }
    return x == y;
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
  identity: (...args) => args[0],
  toPath(path) {
    return this.isString(path) ? path.match(/\w+/g) : path;
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
  matches(src) {
    return obj => this.isMatch(obj, src);
  },
  property(path) {
    return obj => this.toPath(path).reduce((res, it) => res[it], obj);
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
  initial: array => array.slice(0, -1),
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
  pullAt: (array, indexes) =>
    indexes
      .sort((a, b) => b - a)
      .reduce((res, i) => [...array.splice(i, 1), ...res], []),
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
  flip: f => (...args) => f(...args.reverse()),
  forIn(obj, func = this.identity) {
    func = this.iteratee(func);
    for (const key in obj) {
      if (func(obj[key], key, obj) === false) {
        break;
      }
    }
    return obj;
  },
  forOwn(object, func = this.identity) {
    func = this.iteratee(func);
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        if (func(object[key], key, object) === false) {
          break;
        }
      }
    }
    return object;
  },
  set: (object, path, value) => {
    path = (typeof path === "string" ? path.match(/\w+/g) : path).map(it =>
      Number(it) >= 0 ? +it : it,
    );
    path.reduce((res, p, i) => {
      if (i === path.length - 1) {
        res[p] = value;
      } else if (!res[p] && typeof path[i + 1] === "string") {
        res[p] = {};
      } else if (!res[p] && typeof path[i + 1] === "number") {
        res[p] = [];
      }
      return res[p];
    }, object);
    return object;
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
        if (func[i](a) < func[i](b)) return -flag;
        if (func[i](a) > func[i](b)) return flag;
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
  reduceRight(collection, func = this.identity, accumulator) {
    func = this.iteratee(func);
    const reversed = collection.slice().reverse();
    return reversed.reduce(
      (accumulator, value, index, collection) =>
        func(accumulator, value, index, collection),
      accumulator,
    );
  },
  reject(collection, predicate = this.identity) {
    predicate = this.iteratee(predicate);
    return collection.filter((it, i, arr) => !predicate(it, i, arr));
  },
  sample(collection) {
    return collection[Math.floor(Math.random() * collection.length)];
  },
  sampleSize(collection, n = 1) {
    return collection.sort(() => Math.random() - 1).slice(0, n);
  },
  shuffle(collection) {
    return collection.sort(() => Math.random() - 1);
  },
  size: collection => collection.length || Object.keys(collection).length,
  flatMap(collection, func = this.identity) {
    return collection.flatMap(func);
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

  keyBy(collection, func = this.identity) {
    return collection.reduce((res, obj) => (res[func(obj)] = obj && res), {});
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
  // memoize: f => (
  //   (memo = {}),
  //   (...args) => (args in memo ? memo[args] : (memo[args] = f(...args))
  // ,
  spread: f => args => f(...args),
  any: (f, n = f.length) => (...args) => f(...args.slice(0, n)),
  bind: (f, ...args1) => (...args2) => f(...args1, ...args2),
  negate: f => (...args) => !f(...args),
};
