import { ITable } from './_types'
// eslint-disable-next-line camelcase
import { sheets_v4 } from 'googleapis'
import { IUtilisateur } from '../../types'
import * as decamelize from 'decamelize'
import credentials from './credentials'
import {
  spreadsheetValuesGet,
  spreadsheetBatchUpdate
} from '../api-google-spreadsheets/index'
import rowsCreate from './_utils/rows-create'
import rowFormat from './_utils/row-format'
import definition from './definitions/utilisateurs'

const requestsBuild = (utilisateurs: IUtilisateur[], tables: ITable[]) =>
  // pour mettre à jour les tables `utilisateurs` et `utilisateurs__entreprises`
  // il faut
  // - d'abord, supprimer les lignes correspondantes
  // - puis, ajouter les nouvelles lignes à la fin de la spreadsheet
  tables.reduce(async (
    // eslint-disable-next-line camelcase
    requestsPromise: Promise<sheets_v4.Schema$Request[]>,
    { id: sheetId, name, columns, parents, callbacks }
  ) => {
    // retourne une ou plusieurs lignes de spreadsheet à insérer
    // si il s'agit d'une table de jointure, il y a plusieurs lignes
    // et toutes les lignes ont le même id = `rows[0][0]`
    const rows = rowsCreate(utilisateurs, parents).map(
      ({ element: row, parent }: { element: any; parent: any }) =>
        rowFormat(row, columns, callbacks, parent) as string[]
    )

    // construit les requêtes de suppression et d'ajout de rows
    const rowsAppendRequests = rows.map((values: string[]) => {
      const rows = [
        {
          values: values.map(v => ({ userEnteredValue: { stringValue: v } }))
        }
      ]

      const fields = '*'

      return { appendCells: { sheetId, rows, fields } }
      // eslint-disable-next-line camelcase
    }) as sheets_v4.Schema$Request[]

    const worksheet = await spreadsheetValuesGet(
      credentials,
      definition.id,
      decamelize(name, { separator: '-' })
    )

    // trouve l'id de l'élément à supprimer
    // si il n'y a pas de ligne (il s'agit d'une table de jointure vidée: entreprise ou administration)
    // - on prend l'id de l'élément parent (utilisateur)
    // sinon
    // - on prend l'id de la première ligne à ajouter
    const id = !rows.length && parents ? utilisateurs[0].id : rows[0][0]

    // trouve l'index de la ligne à supprimer
    // (ou des lignes si il s'agit d'une table de jointure)
    const rowsIndices = rowsIndicesFind(worksheet, id)

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
      // eslint-disable-next-line camelcase
    })) as sheets_v4.Schema$Request[]

    const requestsTable = [...rowsDeleteRequests, ...rowsAppendRequests]

    if (requestsTable.length) {
      // eslint-disable-next-line camelcase
      const requests = await requestsPromise
      requests.push(...requestsTable)

      return Promise.resolve(requests)
    }

    return requestsPromise
  }, Promise.resolve([]))

const utilisateurRowUpdate = async (utilisateur: IUtilisateur) => {
  try {
    if (!definition.id) throw new Error("l'id de la spreadsheet est absente")

    const requests = await requestsBuild([utilisateur], definition.tables)

    if (requests.length) {
      await spreadsheetBatchUpdate(credentials, definition.id, requests)
    }
  } catch (e) {
    console.info("erreur: ajout d'une ligne dans la spreasheet utilisateurs", e)
  }
}

// eslint-disable-next-line camelcase
const rowsIndicesFind = (worksheet: sheets_v4.Schema$ValueRange, id: string) =>
  worksheet.values
    ? worksheet.values.reduce((rowsIndices, [rowId], index) => {
        if (rowId === id) {
          rowsIndices.push(index)
        }

        return rowsIndices
      }, [])
    : []

export { utilisateurRowUpdate }
