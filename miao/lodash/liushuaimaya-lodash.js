var liushuaimaya = {
  compact: function (ary) {
    return ary.filter(it => it)
  },
  chunk: function (ary, size = 1) {
    let res = [];
    for (let i = 0; i < ary.length / size | 0; i++) {
      res.push([]);
    };
    ary.forEach((a, i) => { res[i / size | 0].push(a) });
    return res;
  },
  filter: function filter(collection, predicate) {
    let res = [];
      for (let index in collection) {
        if (predicate(collection[index], index, collection)) {
          res.push(collection[index]);
        }
    }
    return res;
  }
}
