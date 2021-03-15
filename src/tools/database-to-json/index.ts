import 'dotenv/config'
import { rmdir, writeFileSync } from 'fs'
import * as makeDir from 'make-dir'
import * as decamelize from 'decamelize'

import { ICoordonnees } from '../../types'
import knex from '../../init'
import { tables } from './tables'

const repSources = 'sources'

const databaseToJsonExport = async () => {
  const dir = `./${repSources}`

  await rmdir(dir, { recursive: true }, err => {
    if (err) {
      throw err
    }
    makeDir(dir)
  })

  for (const table of tables) {
    const fileName = `${table.replace(/_/g, '-')}.json`
    const filePath = `${repSources}/${fileName}`

    const json = format(await knex.from(table))

    if (json) {
      writeFileSync(filePath, JSON.stringify(json, null, 2))
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
