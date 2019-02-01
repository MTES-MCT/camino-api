const dedup = (key, ...arrays) =>
  arrays.reduce(
    (result, array) =>
      array.reduce(
        (res, el) =>
          !res.find(e => el[key] && e[key] === el[key]) ? [...res, el] : res,
        result
      ),
    []
  )

const findup = (array, key1, key2) =>
  array.reduce(
    (res, el) =>
      res.find(e => e[key1] === el[key1] && e[key2] === el[key2])
        ? res
        : [...res, el],
    []
  )

export { dedup, findup }
