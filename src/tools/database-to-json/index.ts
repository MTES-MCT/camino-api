import { rm, writeFileSync } from 'fs'
import makeDir from 'make-dir'
import decamelize from 'decamelize'

import { ICoordonnees } from '../../types'
import { knex } from '../../knex'
import { tables } from './tables'

const dir = 'sources'

const databaseToJsonExport = async () => {
  await rm(`./${dir}`, { recursive: true, force: true }, err => {
    if (err) {
      throw err
    }
    makeDir(`./${dir}`)
  })

  for (const table of tables) {
    const fileName = `${table.replace(/_/g, '-')}on`
    const filePath = `${dir}/${fileName}`

    const json = format(await knex.from(table))

    if (json) {
      writeFileSync(filePath, JSON.stringify(json, null, 2))
    } else {
      console.error(`la table ${table} est vide`)
    }
  }
}

interface IFields {
  [key: string]: IFields | string
}

const format = (elements: IFields[]) =>
  elements.map(e =>
    Object.keys(e).reduce((acc: IFields, k: string) => {
      if (e[k]) {
        acc[decamelize(k)] = fieldFormat(e, k)
      }

      return acc
    }, {})
  )

const fieldFormat = (field: IFields, key: string) => {
  if (key === 'coordonnees') {
    const coordonnees = (field[key] as unknown) as ICoordonnees

    return `${coordonnees.x},${coordonnees.y}`
  }

  return field[key]
}

export { databaseToJsonExport }
