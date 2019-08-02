// exporte des tables de la base de données
// vers des google spreadsheets

import * as decamelize from 'decamelize'
import credentials from '../credentials'
import rowFormat from './row-format'
import rowsCreate from './rows-create'

import {
  spreadsheetGet,
  spreadsheetBatchUpdate
} from '../../api-google-spreadsheets'

const dbToSpreadsheets = async ({ name, id, get, tables }) => {
  if (!id) {
    console.log(`spreadsheet: ${name}, id de la spreadsheet manquant`)

    return
  }

  console.log(`spreadsheet: ${name}`)
  const elements = await get()

  // obtient les infos sur la spreadsheet
  const infos = await spreadsheetGet(credentials, id)
  const requests = requestsBuild(infos.sheets, tables, elements)

  await spreadsheetBatchUpdate(credentials, id, requests)
  console.log(`export: ${elements.length} ${name}`)
}

const requestsBuild = (sheets, tables, elements) => {
  const requests = []

  // il est impossible de supprimer tous les onglets dans une spreadsheet,
  // donc on crée un onglet `tmp` vide, le temps de faire le ménage

  const worksheetTmpExists = sheets.find(
    ({ properties }) => properties.title === 'camino-api-tmp'
  )

  if (!worksheetTmpExists) {
    requests.push({
      addSheet: { properties: { title: 'camino-api-tmp', sheetId: 999 } }
    })
  }

  // requêtes pour supprimer tous les onglets sauf `tmp`
  sheets
    .filter(({ properties }) => properties.title !== 'camino-api-tmp')
    .forEach(({ properties }) => {
      requests.push({
        deleteSheet: { sheetId: properties.sheetId }
      })
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

    const header = {
      values: columns.map(h => ({
        userEnteredValue: { stringValue: decamelize(h.value || h) }
      }))
    }

    const content = rowsToRowData({ columns, parents, callbacks }, elements)

    const rows = [header, ...content]

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

const rowsToRowData = ({ columns, parents, callbacks }, elements) =>
  rowsCreate(elements, parents).map(({ element: row, parent }) => ({
    values: rowFormat(row, columns, parent, callbacks).map(r => ({
      userEnteredValue: { stringValue: r }
    }))
  }))

export default dbToSpreadsheets
