import { serialize, deserialize } from 'v8'

import { Index } from '../types'

const dupRemove = (key: string, ...arrays: Index<any>[][]) =>
  arrays.reduce(
    (result, array) =>
      array.reduce((res: Index<any>[], el) => {
        if (!res.find(e => !el[key] || e[key] === el[key])) {
          res.push(el)
        }

        return res
      }, result),
    []
  )

const dupFind = (key: string, ...arrays: Index<any>[][]) =>
  arrays.reduce(
    (result: Index<any>[], array) =>
      result.filter(el => array.find(e => e[key] && e[key] === el[key])),
    arrays.pop() as Index<any>[]
  )

interface IIndexCount {
  [key: string]: Index<any>[]
}

const diffFind = (key: string, ...arrays: (Index<any>[] | null)[]) => {
  const indexCount = arrays.reduce(
    (indexCount: IIndexCount, array: Index<any>[] | null) =>
      array
        ? array.reduce((indexCount, index) => {
            if (!indexCount[index[key]]) {
              indexCount[index[key]] = []
            }

            indexCount[index[key]].push(index)

            return indexCount
          }, indexCount)
        : indexCount,
    {}
  )

  return Object.keys(indexCount).reduce((arrayDiff: Index<any>[], key) => {
    // on ne garde que les éléments uniques
    if (indexCount[key].length === 1) {
      arrayDiff.push(indexCount[key][0])
    }

    return arrayDiff
  }, [])
}

const objectsDiffer = (a: Index<any> | any, b: Index<any> | any): boolean => {
  const comparator = (a: Index<any> | any, b: Index<any> | any) =>
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

  if (typeof a !== 'object' && typeof b !== 'object') {
    return a !== b
  }

  return comparator(a, b) || comparator(b, a)
}

const objectClone = (obj: any) => deserialize(serialize(obj))

export { objectClone, dupRemove, dupFind, diffFind, objectsDiffer }
