import * as decamelize from 'decamelize'
import credentials from './credentials'
import {
  spreadsheetValuesGet,
  spreadsheetBatchUpdate
} from '../api-google-spreadsheets'
import rowFormat from './_utils/row-format'
import spreadsheet from './spreadsheets/titres-activites'

const table = spreadsheet.tables[0]

const titreActivitesRowUpdate = async (
  activites,
  idGet = values => values[0]
) => {
  try {
    // l'API Google ne permet pas de mettre à jour une ligne
    // en fonction de la valeur d'une de ses cellules (id)
    // on est obligé de faire 2 requêtes:
    // - pour trouver l'index de la ligne à modifier
    // - pour la mettre à jour

    if (!spreadsheet.id) throw new Error("l'id de la spreadsheet est absente")

    const worksheet = await spreadsheetValuesGet(
      credentials,
      spreadsheet.id,
      decamelize(table.name)
    )

    const requests = activites.map(activite => {
      const values = rowFormat(activite, table.columns, null, table.callbacks)

      const id = idGet(values)
      const rowIndex = rowIndexFind(worksheet, id)
      const sheetId = table.id

      const rows = [
        { values: values.map(v => ({ userEnteredValue: { stringValue: v } })) }
      ]
      const fields = '*'

      return rowIndex > 0
        ? // si l'activité existe déjà, on la met à jour
          {
            updateCells: {
              start: { sheetId, rowIndex, columnIndex: 0 },
              rows,
              fields
            }
          }
        : // sinon on la créée
          { appendCells: { sheetId, rows, fields } }
    })

    await spreadsheetBatchUpdate(credentials, spreadsheet.id, requests)
  } catch (e) {
    console.log("erreur: ajout d'une ligne dans la spreasheet activités", e)
  }
}

const rowIndexFind = (worksheet, id) => {
  return worksheet.values.findIndex(([rowId]) => rowId === id)
}

export { titreActivitesRowUpdate }
