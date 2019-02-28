import credentials from './credentials'
import spreadsheetRowAdd from './_utils/spreadsheet-row-add'
import spreadsheetRowUpdate from './_utils/spreadsheet-row-update'
import tables from './tables/titres-actvites'

const titreActivitesRapportRowAdd = async content => {
  const spreadsheetId =
    process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_ACTIVITES_RAPPORTS

  await spreadsheetRowAdd(spreadsheetId, credentials, tables[0], content)
}

const titreActivitesRapportRowUpdate = async content => {
  const spreadsheetId =
    process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_ACTIVITES_RAPPORTS

  try {
    await spreadsheetRowUpdate(spreadsheetId, credentials, tables[0], content)
  } catch (e) {
    console.log("erreur lors de l'ajout d'une ligne dans la spreasheet", e)
  }
}

export { titreActivitesRapportRowAdd, titreActivitesRapportRowUpdate }
