// exporte des tables de la base de données
// vers des google spreadsheets

// eslint-disable-next-line camelcase
import { sheets_v4 } from 'googleapis'
import { ISpreadsheetMultiple, ITable } from './_types'

import * as decamelize from 'decamelize'
import credentials from './credentials'
import rowFormat from './_utils/row-format'

import {
  spreadsheetGet,
  spreadsheetBatchUpdate
} from '../api-google-spreadsheets/index'

const elementsBuild = async (gets: {
  [name: string]: () => Promise<any[]>
}) => {
  const elements = {} as { [name: string]: any[] }
  for (const name of Object.keys(gets)) {
    elements[name] = await gets[name]()
  }

  return elements
}

const dbsToSpreadsheet = async ({
  name,
  id,
  tables,
  gets
}: ISpreadsheetMultiple) => {
  if (!id) {
    console.info(`spreadsheet: ${name}, id de la spreadsheet manquant`)

    return
  }

  console.info(`spreadsheet: ${name}`)

  const elements = await elementsBuild(gets)

  // obtient les infos sur la spreadsheet
  const infos = await spreadsheetGet(credentials, id)
  const requests = requestsBuild(infos.sheets, tables, elements)

  await spreadsheetBatchUpdate(credentials, id, requests)

  console.info(`export: metas`)
}

const requestsBuild = (
  // eslint-disable-next-line camelcase
  sheets: sheets_v4.Schema$Sheet[] | undefined,
  tables: ITable[],
  elements: { [name: string]: any[] }
) => {
  if (!sheets) {
    throw new Error('worksheet manquante')
  }

  const requests = []

  // il est impossible de supprimer tous les onglets dans une spreadsheet,
  // donc on crée un onglet `tmp` vide, le temps de faire le ménage

  const worksheetTmpExists = sheets.find(
    ({ properties }) => properties?.title === 'camino-api-tmp'
  )

  if (!worksheetTmpExists) {
    requests.push({
      addSheet: { properties: { title: 'camino-api-tmp', sheetId: 999 } }
    })
  }

  // requêtes pour supprimer tous les onglets sauf `tmp`
  sheets
    .filter(({ properties }) => properties?.title !== 'camino-api-tmp')
    .forEach(({ properties }) => {
      if (properties) {
        requests.push({ deleteSheet: { sheetId: properties.sheetId } })
      }
    })

  tables.forEach(({ id, name, columns, callbacks }) => {
    // requêtes pour ajouter les nouveaux onglets
    requests.push({
      addSheet: {
        properties: {
          sheetId: id,
          title: decamelize(name),
          sheetType: 'GRID',
          gridProperties: {
            columnCount: columns.length,
            rowCount: 2,
            frozenRowCount: 1
          }
        }
      }
    })

    const rows = [
      {
        values: columns.map(h => ({
          userEnteredValue: {
            stringValue: decamelize(typeof h === 'object' ? h.id : h)
          }
        }))
      },
      ...rowsToRowData({ columns, callbacks } as ITable, elements[name])
    ]

    // requêtes pour ajouter le contenu de chaque onglet
    requests.push({ appendCells: { sheetId: id, rows, fields: '*' } })
  })

  // supprime l'onglet `tmp`
  requests.push({ deleteSheet: { sheetId: 999 } })

  return requests
}

const rowsToRowData = <T>({ columns, callbacks }: ITable, elements: T[]) => {
  const rows = Array.isArray(elements)
    ? elements.map(element => ({ element }))
    : [{ element: elements }]

  return rows.map(({ element: row }: { element: any }) => {
    const rowFormatted = rowFormat(row, columns, callbacks) as string[]

    const values = rowFormatted.map(r => ({
      userEnteredValue: { stringValue: r }
    }))

    return { values }
  })
}

export default dbsToSpreadsheet
