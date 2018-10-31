const { titresGet } = require('../../postgres/queries/titres')
const { utilisateursGet } = require('../../postgres/queries/utilisateurs')

const titresTables = require('./tables-titres')
const utilisateursTables = require('./tables-utilisateurs')

const titresCSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_C
const titresFSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_F
const titresGSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_G
const titresHSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_H
const titresMSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_M
const titresRSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_R
const titresSSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_S
const titresWSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_W
// const metasSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_METAS
// const entreprisesSpreadsheetId =
//   process.env.GOOGLE_SPREADSHEET_ID_EXPORT_ENTREPRISES
const utilisateursSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_EXPORT_UTILISATEURS
// const administrationsSpreadsheetId =
//   process.env.GOOGLE_SPREADSHEET_ID_EXPORT_ADMINISTRATIONS
// const substancesSpreadsheetId =
//   process.env.GOOGLE_SPREADSHEET_ID_EXPORT_SUBSTANCES

const titresFetch = domaineId =>
  titresGet({
    typeIds: undefined,
    domaineIds: [domaineId],
    statutIds: undefined,
    substances: undefined,
    noms: undefined
  })

const utilisateursFetch = () => utilisateursGet({})

const spreadsheets = [
  {
    name: 'utilisateurs',
    id: utilisateursSpreadsheetId,
    fetch: utilisateursFetch(),
    tables: utilisateursTables
  },
  {
    name: 'titres-c',
    id: titresCSpreadsheetId,
    fetch: titresFetch('c'),
    tables: titresTables
  },
  {
    name: 'titres-f',
    id: titresFSpreadsheetId,
    fetch: titresFetch('f'),
    tables: titresTables
  },
  {
    name: 'titres-g',
    id: titresGSpreadsheetId,
    fetch: titresFetch('g'),
    tables: titresTables
  },
  {
    name: 'titres-h',
    id: titresHSpreadsheetId,
    fetch: titresFetch('h'),
    tables: titresTables
  },
  {
    name: 'titres-m',
    id: titresMSpreadsheetId,
    fetch: titresFetch('m'),
    tables: titresTables
  },
  {
    name: 'titres-r',
    id: titresRSpreadsheetId,
    fetch: titresFetch('r'),
    tables: titresTables
  },
  {
    name: 'titres-s',
    id: titresSSpreadsheetId,
    fetch: titresFetch('s'),
    tables: titresTables
  },
  {
    name: 'titres-w',
    id: titresWSpreadsheetId,
    fetch: titresFetch('w'),
    tables: titresTables
  }
]

module.exports = spreadsheets
