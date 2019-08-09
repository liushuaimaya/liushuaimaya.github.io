var liushuaimaya = {
  chunk: (ary, size) => ary.map((_, i) => i % size ? null : ary.slice(i, i + size)).filter(Boolean),
  compact: ary => ary.filter(Boolean),
  difference: (ary, ...args) => ary.filter(x => !(new Set(args.reduce((res, a) => res.concat(...a), []))).has(x)),
  property: path => obj => (Array.isArray(path) ? path : path.split(".")).reduce((res, it) => res[it], obj),
  flatten: ary => [].concat(...ary),
  flattenDeep: ary => ary.reduce((res, it) => res.concat(Array.isArray(it) ? flattenDeep(it) : it), []),
  flattenDepth: (ary, depth = 1) => depth ? [].concat(...flattenDepth(ary, depth - 1)) : ary,
  flip: f => (...args) => f(...args.reverse()),
  filter: (collection, predicate) => {
    // differenceBy: (ary, ...args) => typeof (f = args[args.length - 1]) == "function" ? 
    // ary.filter(x => !(new Set(args.reduce((res, a) => res.concat(...a), [])).map(it => f(it))).has(f(x)))
    // : difference(ary, ...args),
    let res = [];
    for (let index = 0; index < collection.length; index++) {
      if (predicate(collection[index], index, collection)) {
        res.push(collection[index]);
      }
    }
    return res;
  },
  every: (ary, predicate) => ary.reduce((res, a, i, ary) => res && predicate(a, i, ary), true),
  some: (ary, predicate) => ary.reduce((res, a, i, ary) => res || predicate(a, i, ary), false),
  memoize: f => {
    let memo = {};
    return function (...args) {
      if (args in memo) {
        return memo[args];
      } else {
        return memo[args] = f(...args);
      }
    }
  },
  spread: f => args => f(...args),
  any: (f, n = f.length) => (...args) => f(...args.slice(0, n)),
  mapvalues: (obj, f) => {
    for (key in obj) {
      obj[key] = f(obj[key], key, obj);
    }
    return obj;
  },
  bind: (f, ...args1) => (...args2) => f(...args1, ...args2),
  negate: (f, ...args) => () => !f(...args),
  forOwn: function (obj, f) {
    var hasOwn = Object.prototype.hasOwnProperty;
    for (let key in obj) {
      if (hasOwn.call(obj, key)) {
        f(obj[key], key, obj);
      }
    }
  },
  identity: (...args) => args[0],
}