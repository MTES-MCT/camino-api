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
      if (a[k] && b[k]) {
        if (Array.isArray(a[k]) && Array.isArray(b[k])) {
          return a[k].find((a, i) => objectsDiffer(a, b[k][i]))
        }

        if (typeof a[k] === 'object' && typeof b[k] === 'object' && a[k]) {
          return objectsDiffer(a[k], b[k])
        }
      }

      return a[k] !== b[k]
    }) !== undefined
  )
}

const objConditionMatch = (condition, obj, keys = null) => {
  // si les conditions sont testées plusieurs fois, (dans une boucle par ex)
  // alors les clés de l'objet de condition peuvent être passées optionnellement
  // pour ne pas les recalculer à chaque fois
  const conditionKeys = keys || Object.keys(condition)

  return conditionKeys.every(k =>
    // si la condition est multiple (tableau)
    Array.isArray(condition[k])
      ? // teste si l'objet contient au moins une des valeurs
        condition[k].includes(obj[k])
      : // sinon, teste la valeur exacte
        condition[k] === obj[k]
  )
}

export { dupRemove, dupFind, objectsDiffer, objConditionMatch }
