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
  // pour mettre à jour les tables `utilisateurs` et `utilisateurs__entreprises`
  // il faut
  // - d'abord, supprimer les lignes correspondantes
  // - puis, ajouter les nouvelles lignes à la fin de la spreadsheet
  tables.reduce(
    async (requests, { id: sheetId, name, columns, parents, callbacks }) => {
      // retourne une ou plusieurs lignes de spreadsheet à insérer
      // si il s'agit d'une table de jointure, il y a plusieurs lignes
      // et toutes les lignes ont le même id = `rows[0][0]`
      const rows = rowsCreate(elements, parents).map(
        ({ element: row, parent }) => rowFormat(row, columns, parent, callbacks)
      )

      if (!rows.length) return requests

      // construit les requêtes de suppression et d'ajout de rows
      const rowsAppendRequests = rows.map(values => {
        const rows = [
          {
            values: values.map(v => ({ userEnteredValue: { stringValue: v } }))
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
      const rowsDeleteRequests = rowsIndices.map((rowIndex, i) => ({
        deleteDimension: {
          range: {
            sheetId: sheetId,
            dimension: 'ROWS',
            // retranche le nombre de lignes déjà supprimées `i`
            // pour tomber sur le nouvel index
            // après suppression des lignes précédentes
            startIndex: rowIndex - i,
            endIndex: rowIndex + 1 - i
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
    if (!spreadsheet.id) throw new Error("l'id de la spreadsheet est absente")

    const requests = await requestsBuild([utilisateur], spreadsheet.tables)

    if (requests.length) {
      await spreadsheetBatchUpdate(credentials, spreadsheet.id, requests)
    }
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
