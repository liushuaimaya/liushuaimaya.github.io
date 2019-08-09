var liushuaimaya = {
  /** ONE LINE VERSION **/
  chunk: (ary, size) => ary.map((_, i) => i % size ? null : ary.slice(i, i + size)).filter(Boolean),
  compact: ary => ary.filter(Boolean),
  difference: (ary, ...args) => ary.filter(x => !args.flat().includes(x)),
  drop: (arr, n = 1) => arr.slice(n),
  dropRight: (arr, n = 1) => arr.slice(0, n ? -n : arr.length),
  // dropRightWhile: (arr, n = 1) => arr.slice(0, n ? -n : arr.length),
  property: path => obj => (Array.isArray(path) ? path : path.split(".")).reduce((res, it) => res[it], obj),
  flatten: ary => [].concat(...ary),
  flattenDeep: ary => ary.reduce((res, it) => res.concat(Array.isArray(it) ? flattenDeep(it) : it), []),
  flattenDepth: (ary, depth = 1) => depth ? [].concat(...flattenDepth(ary, depth - 1)) : ary,
  indexOf: Array.prototype.indexOf.call,
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





  //** ORIGIN VERSION **/
  differenceBy: (ary, ...args) => {
    let f = it => it, last = args.pop();
    if (typeof last == "function") f = last;
    if (Array.isArray(last)) ary.push(last);
    if (typeof last == "string") f = obj => last.split(".").reduce((re, p) => re[p], obj);
    return ary.filter(x => args.flat().map(it => f(it)).includes(f(x)));
  }
  // indexOf: (arr, val, fromIndex = 0) => {
  //   if (fromIndex < 0) fromIndex = fromIndex + arr.length;
  //   for (let i = fromIndex; i < arr.length; i++) {
  //     if (arr[i] == val) return i;
  //   }
  // },
}