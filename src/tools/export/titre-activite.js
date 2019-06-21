import * as decamelize from 'decamelize'
import credentials from './credentials'
import {
  spreadsheetValuesGet,
  spreadsheetBatchUpdate
} from '../api-google-spreadsheets'
import rowFormat from './_utils/row-format'
import spreadsheet from './spreadsheets/titres-activites'

const table = spreadsheet.tables[0]

const titreActiviteRowUpdate = async activite => {
  try {
    // l'API Google ne permet pas de mettre à jour une ligne
    // en fonction de la valeur d'une de ses cellules (id)
    // on est obligé de faire 2 requêtes:
    // - pour trouver l'index de la ligne à modifier
    // - pour la mettre à jour

    const values = rowFormat(activite, table.columns, null, table.callbacks)

    const rowIndex = await rowIndexFind(values)
    const sheetId = table.id
    const rows = [
      { values: values.map(v => ({ userEnteredValue: { stringValue: v } })) }
    ]
    const fields = '*'

    const request =
      rowIndex > 0
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

    await spreadsheetBatchUpdate(credentials, spreadsheet.id, [request])
  } catch (e) {
    console.log("erreur lors de l'ajout d'une ligne dans la spreasheet", e)
  }
}

const rowIndexFind = async values => {
  const worksheet = await spreadsheetValuesGet(
    credentials,
    spreadsheet.id,
    decamelize(table.name)
  )

  return worksheet.values.findIndex(v => v[0] === values[0])
}

export { titreActiviteRowUpdate }
