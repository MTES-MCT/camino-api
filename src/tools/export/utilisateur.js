import * as decamelize from 'decamelize'
import credentials from './credentials'
import {
  spreadsheetValuesGet,
  spreadsheetBatchUpdate
} from '../api-google-spreadsheets'
import rowsCreate from './_utils/rows-create'
import rowFormat from './_utils/row-format'
import spreadsheet from './spreadsheets/utilisateurs'

const requestsBuild = (elements, tables) =>
  tables.reduce(
    async (requests, { id: sheetId, name, columns, parents, callbacks }) => {
      // retourne une ou plusieurs lignes de spreadsheet à insérer
      // si il s'agit d'une table de jointure, il y a plusieurs lignes
      // et toutes les lignes ont le même id = `rows[0][0]`
      const rows = rowsCreate(elements, parents).map(
        ({ element: row, parent }) => ({
          // formate la ligne
          values: rowFormat(row, columns, parent, callbacks).map(
            stringValue => ({
              userEnteredValue: { stringValue }
            })
          )
        })
      )

      // construit les requêtes de suppression et d'ajout de rows
      const rowsAppendRequests = rows.map(rowValues => {
        const rows = [
          {
            values: rowValues.map(v => ({
              userEnteredValue: { stringValue: v }
            }))
          }
        ]
        const fields = '*'

        return { appendCells: { sheetId, rows, fields } }
      })

      const worksheet = await spreadsheetValuesGet(
        credentials,
        spreadsheet.id,
        decamelize(name)
      )

      // trouve l'index de la ligne à supprimer
      // (ou des lignes si il s'agit d'une table de jointure)
      // à partir de l'id de la première ligne à ajouter
      const rowsIndices = rowsIndicesFind(worksheet, rows[0][0])
      const rowsDeleteRequests = rowsIndices.map(rowIndex => ({
        deleteDimension: {
          range: {
            sheetId: sheetId,
            dimension: 'ROWS',
            startIndex: rowIndex,
            endIndex: rowIndex + 1
          }
        }
      }))

      const requestsTable = [...rowsDeleteRequests, ...rowsAppendRequests]

      return requestsTable.length
        ? [...(await requests), ...requestsTable]
        : requests
    },
    []
  )

const utilisateurRowUpdate = async utilisateur => {
  try {
    // l'API Google ne permet pas de mettre à jour une ligne
    // en fonction de la valeur d'une de ses cellules (id)
    // on est obligé de faire 2 requêtes:
    // - pour trouver l'index de la ligne à modifier
    // - pour la mettre à jour

    if (!spreadsheet.id) throw new Error("l'id de la spreadsheet est absente")

    const requests = requestsBuild(utilisateur, spreadsheet.tables)

    await spreadsheetBatchUpdate(credentials, spreadsheet.id, requests)
  } catch (e) {
    console.log(
      "erreur lors de l'ajout d'une ligne dans la spreasheet utilisateurs",
      e
    )
  }
}

const rowsIndicesFind = (worksheet, id) => {
  return worksheet.values.reduce(
    (rowsIndices, [rowId], index) =>
      rowId === id ? [...rowsIndices, index] : rowsIndices,
    []
  )
}

export { utilisateurRowUpdate }
