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
  flip: f => (...args) => f(...args.reverse())
}