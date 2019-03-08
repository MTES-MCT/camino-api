const titresCSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_C
const titresFSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_F
const titresGSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_G
const titresHSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_H
const titresMSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_M
const titresM973SpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_M973
const titresRSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_R
const titresSSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_S
const titresWSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_W
const metasSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_METAS
const entreprisesSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_ENTREPRISES
const utilisateursSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_UTILISATEURS
const permissionsSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_PERMISSIONS
const administrationsSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_ADMINISTRATIONS
const substancesSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_SUBSTANCES
const titresActivitesSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_TITRES_ACTIVITES
const geoSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_GEO

const jsonParse = value => json =>
  json.map(j =>
    Object.keys(j).reduce((res, cur) => {
      res[cur] = cur === value ? JSON.parse(j[cur]) : j[cur]
      return res
    }, {})
  )

const titresTables = [
  { name: 'titres', cb: jsonParse('references') },
  { name: 'titres_demarches' },
  { name: 'titres_demarches_liens' },
  { name: 'titres_etapes', cb: jsonParse('visas') },
  { name: 'titres_points' },
  { name: 'titres_points_references' },
  { name: 'titres_documents' },
  { name: 'titres_substances' },
  { name: 'titres_titulaires' },
  { name: 'titres_amodiataires' },
  { name: 'titres_emprises' },
  { name: 'titres_erreurs' }
]

const spreadsheets = [
  {
    name: 'titres-c',
    id: titresCSpreadsheetId,
    tables: titresTables,
    prefixFileName: true
  },
  {
    name: 'titres-f',
    id: titresFSpreadsheetId,
    tables: titresTables,
    prefixFileName: true
  },
  {
    name: 'titres-g',
    id: titresGSpreadsheetId,
    tables: titresTables,
    prefixFileName: true
  },
  {
    name: 'titres-h',
    id: titresHSpreadsheetId,
    tables: titresTables,
    prefixFileName: true
  },
  {
    name: 'titres-m',
    id: titresMSpreadsheetId,
    tables: titresTables,
    prefixFileName: true
  },
  {
    name: 'titres-m973',
    id: titresM973SpreadsheetId,
    tables: titresTables,
    prefixFileName: true
  },
  {
    name: 'titres-r',
    id: titresRSpreadsheetId,
    tables: titresTables,
    prefixFileName: true
  },
  {
    name: 'titres-s',
    id: titresSSpreadsheetId,
    tables: titresTables,
    prefixFileName: true
  },
  {
    name: 'titres-w',
    id: titresWSpreadsheetId,
    tables: titresTables,
    prefixFileName: true
  },
  {
    name: 'metas',
    id: metasSpreadsheetId,
    tables: [
      { name: 'domaines' },
      { name: 'types' },
      { name: 'domaines__types' },
      { name: 'statuts' },
      { name: 'demarches_types' },
      { name: 'demarches_statuts' },
      { name: 'demarches_types__types' },
      { name: 'demarches_types__demarches_statuts' },
      { name: 'phases_statuts' },
      { name: 'etapes_types' },
      { name: 'etapes_statuts' },
      { name: 'etapes_types__etapes_statuts' },
      { name: 'demarches_types__etapes_types' },
      { name: 'emprises' },
      { name: 'geo_systemes' },
      { name: 'devises' },
      { name: 'volume_unites' }
    ]
  },
  {
    name: 'entreprises',
    id: entreprisesSpreadsheetId,
    tables: [
      { name: 'titres_c' },
      { name: 'titres_f' },
      { name: 'titres_g' },
      { name: 'titres_h' },
      { name: 'titres_m' },
      { name: 'titres_m973' },
      { name: 'titres_r' },
      { name: 'titres_s' },
      { name: 'titres_w' }
    ],
    prefixFileName: true
  },
  {
    name: 'utilisateurs',
    id: utilisateursSpreadsheetId,
    tables: [{ name: 'utilisateurs', cb: jsonParse('preferences') }]
  },
  {
    name: 'utilisateurs',
    id: permissionsSpreadsheetId,
    tables: [{ name: 'permissions' }]
  },
  {
    name: 'administrations',
    id: administrationsSpreadsheetId,
    tables: [{ name: 'administrations' }]
  },
  {
    name: 'substances',
    id: substancesSpreadsheetId,
    tables: [
      { name: 'substances' },
      { name: 'substances_legales' },
      { name: 'substances_legales_codes' },
      { name: 'substances__substances_legales' }
    ]
  },
  {
    name: 'titresActivites',
    id: titresActivitesSpreadsheetId,
    tables: [{ name: 'titres_activites', cb: jsonParse('contenu') }]
  },
  {
    name: 'geo',
    id: geoSpreadsheetId,
    tables: [
      { name: 'pays' },
      { name: 'regions' },
      { name: 'departements' }
      // { name: 'communes' }
    ]
  }
]

export default spreadsheets
