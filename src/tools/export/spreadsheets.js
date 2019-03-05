import { titresGet } from '../../database/queries/titres'
import { utilisateursGet } from '../../database/queries/utilisateurs'
import { titresActivitesGet } from '../../database/queries/titres-activites'

import titresTables from './tables/titres'
import utilisateursTables from './tables/utilisateurs'
import titresActivitesTables from './tables/titres-actvites'

const titresCSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_C
const titresFSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_F
const titresGSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_G
const titresHSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_H
const titresMSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_M
const titresRSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_R
const titresSSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_S
const titresWSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_W
const utilisateursSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_EXPORT_UTILISATEURS
const titresActivitesSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_ACTIVITES
// const metasSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_METAS
// const entreprisesSpreadsheetId =
//   process.env.GOOGLE_SPREADSHEET_ID_EXPORT_ENTREPRISES
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

const utilisateursFetch = () =>
  utilisateursGet({
    noms: undefined,
    entrepriseIds: undefined,
    administrationIds: undefined,
    permissionIds: undefined
  })

const titresActivitesFetch = () => titresActivitesGet()

const spreadsheets = [
  {
    name: 'utilisateurs',
    spreadsheetId: utilisateursSpreadsheetId,
    fetch: utilisateursFetch(),
    tables: utilisateursTables
  },
  {
    name: 'titres-c',
    spreadsheetId: titresCSpreadsheetId,
    fetch: titresFetch('c'),
    tables: titresTables
  },
  {
    name: 'titres-f',
    spreadsheetId: titresFSpreadsheetId,
    fetch: titresFetch('f'),
    tables: titresTables
  },
  {
    name: 'titres-g',
    spreadsheetId: titresGSpreadsheetId,
    fetch: titresFetch('g'),
    tables: titresTables
  },
  {
    name: 'titres-h',
    spreadsheetId: titresHSpreadsheetId,
    fetch: titresFetch('h'),
    tables: titresTables
  },
  {
    name: 'titres-m',
    spreadsheetId: titresMSpreadsheetId,
    fetch: titresFetch('m'),
    tables: titresTables
  },
  {
    name: 'titres-r',
    spreadsheetId: titresRSpreadsheetId,
    fetch: titresFetch('r'),
    tables: titresTables
  },
  {
    name: 'titres-s',
    spreadsheetId: titresSSpreadsheetId,
    fetch: titresFetch('s'),
    tables: titresTables
  },
  {
    name: 'titres-w',
    spreadsheetId: titresWSpreadsheetId,
    fetch: titresFetch('w'),
    tables: titresTables
  },
  {
    name: 'titres-activites',
    spreadsheetId: titresActivitesSpreadsheetId,
    fetch: titresActivitesFetch(),
    tables: titresActivitesTables
  }
]

export default spreadsheets
