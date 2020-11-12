import { ISpreadsheet } from './types'

const titresCSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_C
const titresFSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_F
const titresGSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_G
const titresHSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_H
const titresMSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_M
const titresRSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_R
const titresSSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_S
const titresWSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TITRES_W
const titresRepriseSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_TITRES_REPRISE

const globalesSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_GLOBALES
const metasSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_METAS
const territoiresSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TERRITOIRES
const foretsSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_FORETS
const calendrierSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_CALENDRIER
const substancesSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_SUBSTANCES

const documentsSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_DOCUMENTS

const entreprisesSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_ENTREPRISES
const administrationsSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_ADMINISTRATIONS
const utilisateursSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_UTILISATEURS

const metasActivitesSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_METAS_ACTIVITES
const titresActivitesSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_TITRES_ACTIVITES
const titresTravauxSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_TITRES_TRAVAUX
const titresActivitesRepriseSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_TITRES_ACTIVITES_REPRISE

const titresTables = [
  { name: 'titres', cb: { props_titre_etapes_ids: JSON.parse } },
  { name: 'titres_references' },
  { name: 'titres_demarches' },
  { name: 'titres_demarches_liens' },
  { name: 'titres_phases' },
  { name: 'titres_etapes', cb: { contenu: JSON.parse } },
  { name: 'titres_points' },
  { name: 'titres_points_references' },
  { name: 'titres_etapes_justificatifs' },
  { name: 'titres_substances' },
  { name: 'titres_titulaires' },
  { name: 'titres_amodiataires' },
  { name: 'titres_communes' },
  { name: 'titres_forets' },
  { name: 'titres_administrations_gestionnaires' },
  { name: 'titres_administrations_locales' },
  { name: 'titres_incertitudes' }
]

const titresC = {
  name: 'titres-c',
  id: titresCSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
} as ISpreadsheet

const titresF = {
  name: 'titres-f',
  id: titresFSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
} as ISpreadsheet

const titresG = {
  name: 'titres-g',
  id: titresGSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
} as ISpreadsheet

const titresH = {
  name: 'titres-h',
  id: titresHSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
} as ISpreadsheet

const titresM = {
  name: 'titres-m',
  id: titresMSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
} as ISpreadsheet

const titresR = {
  name: 'titres-r',
  id: titresRSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
} as ISpreadsheet

const titresS = {
  name: 'titres-s',
  id: titresSSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
} as ISpreadsheet

const titresW = {
  name: 'titres-w',
  id: titresWSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
} as ISpreadsheet

const titres = [
  titresC,
  titresF,
  titresG,
  titresH,
  titresM,
  titresR,
  titresS,
  titresW
]

// feuille optionnelle pour la reprise de données
const titresReprise = {
  id: titresRepriseSpreadsheetId,
  name: 'titres-reprise',
  tables: titresTables,
  prefixFileName: true
} as ISpreadsheet

const metas = {
  name: 'metas',
  id: metasSpreadsheetId,
  tables: [
    { name: 'definitions' },
    { name: 'domaines' },
    { name: 'titres_types', cb: { props_etapes_types: JSON.parse } },
    { name: 'titres_types_types' },
    { name: 'titres_statuts' },
    { name: 'titres_types__titres_statuts' },
    { name: 'demarches_types' },
    { name: 'demarches_statuts' },
    { name: 'titres_types__demarches_types' },
    { name: 'demarches_types__demarches_statuts' },
    { name: 'phases_statuts' },
    { name: 'etapes_types', cb: { sections: JSON.parse } },
    { name: 'etapes_statuts' },
    { name: 'etapes_types__etapes_statuts' },
    {
      name: 'titres_types__demarches_types__etapes_types',
      cb: { sections: JSON.parse }
    },

    { name: 'travaux_types' },
    { name: 'travaux_types__demarches_statuts' },
    { name: 'travaux_types__etapes_types' },
    { name: 'geo_systemes' },
    { name: 'devises' },
    { name: 'unites' },
    { name: 'administrations_types' },
    { name: 'permissions' },
    { name: 'documents_types' },
    { name: 'references_types' }
  ]
} as ISpreadsheet

const substances = {
  name: 'substances',
  id: substancesSpreadsheetId,
  tables: [
    { name: 'substances' },
    { name: 'substances_legales' },
    { name: 'substances_legales_codes' },
    { name: 'substances__substances_legales' }
  ]
} as ISpreadsheet

const documents = {
  name: 'documents',
  id: documentsSpreadsheetId,
  tables: [{ name: 'documents' }]
} as ISpreadsheet

const territoires = {
  name: 'territoires',
  id: territoiresSpreadsheetId,
  tables: [
    { name: 'pays' },
    { name: 'regions' },
    { name: 'departements' },
    { name: 'communes' }
  ]
} as ISpreadsheet

const forets = {
  name: 'forets',
  id: foretsSpreadsheetId,
  tables: [{ name: 'forets' }]
} as ISpreadsheet

const calendrier = {
  name: 'calendrier',
  id: calendrierSpreadsheetId,
  tables: [
    { name: 'frequences' },
    { name: 'annees' },
    { name: 'trimestres' },
    { name: 'mois' }
  ]
} as ISpreadsheet

const entreprises = {
  name: 'entreprises',
  id: entreprisesSpreadsheetId,
  tables: [{ name: 'entreprises' }, { name: 'entreprises_etablissements' }]
} as ISpreadsheet

const administrations = {
  name: 'administrations',
  id: administrationsSpreadsheetId,
  tables: [
    { name: 'administrations' },
    { name: 'administrations__titres_types' },
    { name: 'administrations__titres_types__titres_statuts' },
    { name: 'administrations__titres_types__etapes_types' }
  ]
} as ISpreadsheet

const utilisateurs = {
  name: 'utilisateurs',
  id: utilisateursSpreadsheetId,
  tables: [
    { name: 'utilisateurs', cb: { preferences: JSON.parse } },
    { name: 'utilisateurs__entreprises' },
    { name: 'utilisateurs__administrations' }
  ]
} as ISpreadsheet

const metasActivites = {
  name: 'metas-activites',
  id: metasActivitesSpreadsheetId,
  tables: [
    { name: 'activites_types', cb: { sections: JSON.parse } },
    { name: 'activites_statuts' },
    { name: 'titres_types__activites_types' },
    { name: 'activites_types__pays' },
    { name: 'activites_types__administrations' },
    { name: 'activites_types__documents_types' }
  ]
} as ISpreadsheet

const titresActivites = {
  name: 'titres-activites',
  id: titresActivitesSpreadsheetId,
  tables: [{ name: 'titres_activites', cb: { contenu: JSON.parse } }]
} as ISpreadsheet

const titresTravaux = {
  name: 'titres-travaux',
  id: titresTravauxSpreadsheetId,
  tables: [
    { name: 'titres_travaux' },
    { name: 'titres_travaux_etapes', cb: { contenu: JSON.parse } }
  ]
} as ISpreadsheet

const titresActivitesReprise = {
  name: 'titres-activites-reprise',
  id: titresActivitesRepriseSpreadsheetId,
  tables: [{ name: 'titres_activites', cb: { contenu: JSON.parse } }],
  prefixFileName: true
} as ISpreadsheet

const globales = {
  name: 'globales',
  id: globalesSpreadsheetId,
  tables: [{ name: 'globales' }]
} as ISpreadsheet

const spreadsheets = [
  ...titres,
  titresReprise,
  metas,
  substances,
  documents,
  territoires,
  forets,
  calendrier,
  entreprises,
  administrations,
  utilisateurs,
  metasActivites,
  titresActivites,
  titresTravaux,
  titresActivitesReprise,
  globales
]

export default spreadsheets
