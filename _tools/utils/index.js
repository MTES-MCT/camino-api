const dedup = (array1, array2) =>
  array1.reduce(
    (res, el) => (!res.find(e => el.id && e.id === el.id) ? [...res, el] : res),
    array2
  )

const findup = (array, key1, key2) =>
  array.reduce(
    (res, el) =>
      res.find(e => e[key1] === el[key1] && e[key2] === el[key2])
        ? res
        : [...res, el],
    []
  )
module.exports = {
  dedup,
  findup
}
