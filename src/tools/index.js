import * as dateFormat from 'dateformat'

const dupRemove = (key, ...arrays) =>
  arrays.reduce(
    (result, array) =>
      array.reduce(
        (res, el) =>
          res.find(e => !el[key] || e[key] === el[key]) ? res : [...res, el],
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

const objectsDiffer = (a, b) =>
  Object.keys(a).find(k => {
    if (a[k] && b[k]) {
      if (b[k].constructor === Date) {
        return a[k] !== dateFormat(b[k], 'yyyy-mm-dd')
      } else if (Array.isArray(a[k]) && Array.isArray(b[k])) {
        return a[k].find((a, i) => objectsDiffer(a, b[k][i]))
      } else if (typeof a[k] === 'object' && typeof b[k] === 'object' && a[k]) {
        return objectsDiffer(a[k], b[k])
      }
    }

    return a[k] !== b[k]
  })

export { dupRemove, dupFind, objectsDiffer }
