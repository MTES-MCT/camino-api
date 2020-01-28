interface Index {
  [id: string]: any
}

const dupRemove = (key: string, ...arrays: Index[][]) =>
  arrays.reduce(
    (result, array) =>
      array.reduce((res: Index[], el) => {
        if (!res.find(e => !el[key] || e[key] === el[key])) {
          res.push(el)
        }

        return res
      }, result),
    []
  )

const dupFind = (key: string, ...arrays: Index[][]) =>
  arrays.reduce(
    (result: Index[], array) =>
      result.filter(el => array.find(e => e[key] && e[key] === el[key])),
    arrays.pop() as Index[]
  )

const objectsDiffer = (a: Index | any, b: Index | any): boolean => {
  if (typeof a !== 'object' && typeof b !== 'object') {
    return a !== b
  }

  return (
    Object.keys(a).find(k => {
      if (a[k] && b[k]) {
        if (Array.isArray(a[k]) && Array.isArray(b[k])) {
          return a[k].find((ak: any, i: number) => objectsDiffer(ak, b[k][i]))
        }

        if (typeof a[k] === 'object' && typeof b[k] === 'object' && a[k]) {
          return objectsDiffer(a[k], b[k])
        }
      }

      return a[k] !== b[k]
    }) !== undefined
  )
}

// TODO: définir une interface IConditions

const objConditionMatch = (
  condition: any,
  obj: Index,
  keys: string[] | null = null
) => {
  // si les conditions sont testées plusieurs fois, (dans une boucle par ex)
  // alors les clés de l'objet de condition peuvent être passées optionnellement
  // pour ne pas les recalculer à chaque fois
  const conditionKeys = keys || Object.keys(condition)

  // si la condition est multiple (tableau)
  // teste si l'objet contient au moins une des valeurs
  // sinon, teste la valeur exacte
  return conditionKeys.every(k =>
    Array.isArray(condition[k])
      ? condition[k].includes(obj[k])
      : condition[k] === obj[k]
  )
}

export { dupRemove, dupFind, objectsDiffer, objConditionMatch }
