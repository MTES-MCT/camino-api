import credentials from './credentials'
import spreadsheetRowAdd from './_utils/spreadsheet-row-add'
import spreadsheetRowUpdate from './_utils/spreadsheet-row-update'
import tables from './tables/titres-actvites'

const titreActiviteRowAdd = async content => {
  const spreadsheetId =
    process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_ACTIVITES

  await spreadsheetRowAdd(spreadsheetId, credentials, tables[0], content)
}

const titreActiviteRowUpdate = async content => {
  const spreadsheetId =
    process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_ACTIVITES

  try {
    await spreadsheetRowUpdate(spreadsheetId, credentials, tables[0], content)
  } catch (e) {
    console.log("erreur lors de l'ajout d'une ligne dans la spreasheet", e)
  }
}

export { titreActiviteRowAdd, titreActiviteRowUpdate }
