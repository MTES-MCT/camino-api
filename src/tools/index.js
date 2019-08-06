import * as dateFormat from 'dateformat'

const dupRemove = (key, ...arrays) =>
  arrays.reduce(
    (result, array) =>
      array.reduce((res, el) => {
        if (!res.find(e => !el[key] || e[key] === el[key])) {
          res.push(el)
        }

        return res
      }, result),
    []
  )

const dupFind = (key, ...arrays) =>
  arrays.reduce(
    (result, array) =>
      result.filter(el => array.find(e => e[key] && e[key] === el[key])),
    arrays.pop()
  )

const objectsDiffer = (a, b) => {
  if (typeof a !== 'object' && typeof b !== 'object') {
    return a !== b
  }

  return (
    Object.keys(a).find(k => {
      let aK = a[k]
      let bK = b[k]

      if (aK && aK.constructor === Date) {
        aK = dateFormat(aK, 'yyyy-mm-dd')
      }

      if (bK && bK.constructor === Date) {
        bK = dateFormat(bK, 'yyyy-mm-dd')
      }

      if (aK && bK) {
        if (Array.isArray(aK) && Array.isArray(bK)) {
          return aK.find((a, i) => objectsDiffer(a, bK[i]))
        }

        if (typeof aK === 'object' && typeof bK === 'object' && aK) {
          return objectsDiffer(aK, bK)
        }
      }

      return aK !== bK
    }) !== undefined
  )
}

export { dupRemove, dupFind, objectsDiffer }
