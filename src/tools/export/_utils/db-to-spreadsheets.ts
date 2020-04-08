// exporte des tables de la base de données
// vers des google spreadsheets

// eslint-disable-next-line camelcase
import { sheets_v4 } from 'googleapis'
import { ISpreadsheet, ITable } from '../types'

import decamelize from '../../decamelize'
import credentials from '../credentials'
import rowFormat from './row-format'
import rowsCreate from './rows-create'

import {
  spreadsheetGet,
  spreadsheetBatchUpdate
} from '../../api-google-spreadsheets/index'

const dbToSpreadsheets = async <T>({
  name,
  id,
  get,
  tables
}: ISpreadsheet<T>) => {
  if (!id) {
    console.info(`spreadsheet: ${name}, id de la spreadsheet manquant`)

    return
  }

  console.info(`spreadsheet: ${name}`)
  const elements = await get()

  // obtient les infos sur la spreadsheet
  const infos = await spreadsheetGet(credentials, id)
  const requests = requestsBuild<T>(infos.sheets, tables, elements)

  await spreadsheetBatchUpdate(credentials, id, requests)
  console.info(`export: ${elements.length} ${name}`)
}

const requestsBuild = <T>(
  // eslint-disable-next-line camelcase
  sheets: sheets_v4.Schema$Sheet[] | undefined,
  tables: ITable[],
  elements: T[]
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

  tables.forEach(({ id, name, columns, parents, callbacks }) => {
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
      ...rowsToRowData<T>({ columns, parents, callbacks } as ITable, elements)
    ]

    // requêtes pour ajouter le contenu de chaque onglet
    requests.push({
      appendCells: {
        sheetId: id,
        rows,
        fields: '*'
      }
    })
  })

  // supprime l'onglet `tmp`
  requests.push({
    deleteSheet: { sheetId: 999 }
  })

  return requests
}

const rowsToRowData = <T>(
  { columns, parents, callbacks }: ITable,
  elements: T[]
) =>
  rowsCreate(elements, parents).map(
    ({ element: row, parent }: { element: any; parent: any }) => ({
      values: (rowFormat(row, columns, parent, callbacks) as string[]).map(
        r => ({
          userEnteredValue: { stringValue: r }
        })
      )
    })
  )

export default dbToSpreadsheets
