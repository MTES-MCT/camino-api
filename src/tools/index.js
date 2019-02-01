const dupRemove = (key, ...arrays) =>
  arrays.reduce(
    (result, array) =>
      array.reduce(
        (res, el) =>
          res.find(e => el[key] && e[key] === el[key]) ? res : [...res, el],
        result
      ),
    []
  )

const dupFind = (key, ...arrays) =>
  arrays.reduce(
    (result, array) =>
      result.filter(el => array.find(e => e[key] && e[key] === el[key])),
    arrays.pop()
  )

export { dupRemove, dupFind }
