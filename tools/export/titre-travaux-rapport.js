const credentials = require('./credentials')
const spreadsheetRowAdd = require('./_utils/spreadsheet-row-add')
const spreadsheetRowUpdate = require('./_utils/spreadsheet-row-update')
const tables = require('./tables/titres-travaux')

const titreTravauxRapportRowAdd = async content => {
  const spreadsheetId =
    process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_TRAVAUX_RAPPORTS

  await spreadsheetRowAdd(spreadsheetId, credentials, tables[0], content)
}

const titreTravauxRapportRowUpdate = async content => {
  const spreadsheetId =
    process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_TRAVAUX_RAPPORTS

  try {
    await spreadsheetRowUpdate(spreadsheetId, credentials, tables[0], content)
  } catch (e) {
    console.log("erreur lors de l'ajout d'une ligne dans la spreasheet", e)
  }
}

module.exports = { titreTravauxRapportRowAdd, titreTravauxRapportRowUpdate }
