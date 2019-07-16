var liushuaimaya = {
  compact: (ary) => {
    return ary.filter(it => it)
  },
  chunk: (ary, size = 1) => {
    let res = [];
    for (let i = 0; i < ary.length / size | 0; i++) {
      res.push([]);
    };
    ary.forEach((a, i) => { res[i / size | 0].push(a) });
    return res;
  },
  flip: f => (...args) => f(...args.reverse()),
  filter: (collection, predicate) => {
    let res = [];
    for (let index in collection) {
      if (predicate(collection[index], index, collection)) {
        res.push(collection[index]);
      }
    }
    return res;
  },
  every: (ary, predicate) => {
    return ary.reduce((res, a, i, ary) => res && predicate(a, i, ary), true);
  },
  some: (ary, predicate) => {
    return ary.reduce((res, a, i, ary) => res || predicate(a, i, ary), false);
  },
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
  spread: f => (args) => f(...args),
  any: (f, n = f.length) => (...args) => f(...args.slice(0, n)),
  mapvalues: (obj, f) => {
    for (key in obj) {
      obj[key] = f(obj[key], key, obj);
    }
    return obj;
  },
  bind: (f, ...args1) => (...args2) => f(...args1, ...args2),
  flatten: ary => [].concat(...ary),
  flattenDeep:  ary => {
    while (ary.some(Array.isArray)) {
      ary = [].concat(...ary);
    }
    return ary;
  },
  flattenDepth:  (ary, depth = 1) => {
    while (depth-- > 0) {
      ary = [].concat(...ary);
    }
    return ary;
  }
}