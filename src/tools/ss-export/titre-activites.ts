// eslint-disable-next-line camelcase
import { sheets_v4 } from 'googleapis'
import { Index, ITitreActivite } from '../../types'
import decamelize from '../decamelize'
import credentials from './credentials'
import {
  spreadsheetValuesGet,
  spreadsheetBatchUpdate
} from '../api-google-spreadsheets/index'
import rowFormat from './_utils/row-format'
import spreadsheet from './spreadsheets/titres-activites'

const table = spreadsheet.tables[0]

const titreActivitesRowUpdate = async (
  activites: ITitreActivite[],
  titresIdsUpdatedIndex?: Index<string>
) => {
  try {
    if (!activites.length) return null

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
      const values = rowFormat(
        activite,
        table.columns,
        null,
        table.callbacks
      ) as string[]

      const titreOldId =
        titresIdsUpdatedIndex && titresIdsUpdatedIndex[activite.titreId]

      // si le titre a changé d'id
      // on doit remplacer la nouvelle id du titre dans l'id de l'activité
      // pour la retrouver et la mettre à jour dans la spreadsheet
      const titreActiviteId = titreOldId
        ? activite.id.replace(activite.titreId, titreOldId)
        : activite.id
      const rowIndex = rowIndexFind(worksheet, titreActiviteId)
      const sheetId = table.id

      const rows = [
        {
          values: values.map(v => ({ userEnteredValue: { stringValue: v } }))
        }
      ]
      const fields = '*'

      return rowIndex >= 0 // si l'activité existe déjà, on la met à jour
        ? {
            updateCells: {
              start: { sheetId, rowIndex, columnIndex: 0 },
              rows,
              fields
            }
          } // sinon on la créée
        : { appendCells: { sheetId, rows, fields } }
    })

    await spreadsheetBatchUpdate(credentials, spreadsheet.id, requests)

    return null
  } catch (e) {
    console.info("erreur: ajout d'une ligne dans la spreasheet activités", e)

    return null
  }
}

const rowIndexFind = (
  // eslint-disable-next-line camelcase
  worksheet: sheets_v4.Schema$ValueRange,
  titreActiviteId: string
) =>
  worksheet.values
    ? worksheet.values.findIndex(([rowId]) => rowId === titreActiviteId)
    : -1

export { titreActivitesRowUpdate }
