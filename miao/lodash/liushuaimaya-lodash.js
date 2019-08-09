var liushuaimaya = {
  chunk: (ary, size) => ary.map((_, i) => i % size ? null : ary.slice(i, i + size)).filter(Boolean),
  compact: ary => ary.filter(Boolean),
  difference: (ary, ...args) => ary.filter(x => !(args.reduce((res, a) => res.concat(a), [])).includes(x)),
  differenceBy: (ary, ...args) => typeof (args[args.length - 1]) == "function" ? ary.filter(x => !(args.slice(0, -1).reduce((res, a) => res.concat(a), [])).map(it => args[args.length - 1](it)).includes(args[args.length - 1](x))) : difference(ary, ...args),
  drop: (arr, n = 1) => arr.silce(n),
  dropRight: (arr, n = 1) => arr.silce(0, -n),
  dropRightWhile: (arr, n = 1) => arr.silce(0, -n),
  property: path => obj => (Array.isArray(path) ? path : path.split(".")).reduce((res, it) => res[it], obj),
  flatten: ary => [].concat(...ary),
  flattenDeep: ary => ary.reduce((res, it) => res.concat(Array.isArray(it) ? flattenDeep(it) : it), []),
  flattenDepth: (ary, depth = 1) => depth ? [].concat(...flattenDepth(ary, depth - 1)) : ary,
  flip: f => (...args) => f(...args.reverse()),
  filter: (collection, predicate) => {
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
  memoize: f => (memo = {}, (...args) => args in memo ? memo[args] : memo[args] = f(...args)),
  spread: f => args => f(...args),
  any: (f, n = f.length) => (...args) => f(...args.slice(0, n)),
  // mapvalues: (obj, f) => {
  //   for (key in obj) {
  //     obj[key] = f(obj[key], key, obj);
  //   }
  //   return obj;
  // }
  bind: (f, ...args1) => (...args2) => f(...args1, ...args2),
  negate: f => (...args) => !f(...args),
  forOwn: function (obj, f) {
    var hasOwn = Object.prototype.hasOwnProperty;
    for (let key in obj) {
      if (hasOwn.call(obj, key)) {
        f(obj[key], key, obj);
      } else break;
    }
    return obj;
  },
  identity: (...args) => args[0],
  // iteratee: arg => (...args) => { }
}