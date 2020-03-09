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
const calendrierSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_CALENDRIER
const substancesSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_SUBSTANCES

const entreprisesSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_ENTREPRISES
const administrationsSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_ADMINISTRATIONS
const administrationsAutorisationsSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_ADMINISTRATIONS_AUTORISATIONS
const utilisateursSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_UTILISATEURS

const autorisationsSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_AUTORISATIONS

const metasActivitesSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_METAS_ACTIVITES
const titresActivitesSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_TITRES_ACTIVITES

const titresTables = [
  { name: 'titres', cb: { references: JSON.parse } },
  { name: 'titres_references' },
  { name: 'titres_demarches' },
  { name: 'titres_demarches_liens' },
  { name: 'titres_phases' },
  { name: 'titres_etapes', cb: { contenu: JSON.parse } },
  { name: 'titres_points' },
  { name: 'titres_points_references' },
  { name: 'titres_documents' },
  { name: 'titres_substances' },
  { name: 'titres_titulaires' },
  { name: 'titres_communes' },
  { name: 'titres_administrations_gestionnaires' },
  { name: 'titres_administrations_locales' },
  { name: 'titres_amodiataires' },
  { name: 'titres_incertitudes' }
]

const titresC = {
  name: 'titres-c',
  id: titresCSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
}

const titresF = {
  name: 'titres-f',
  id: titresFSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
}

const titresG = {
  name: 'titres-g',
  id: titresGSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
}

const titresH = {
  name: 'titres-h',
  id: titresHSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
}

const titresM = {
  name: 'titres-m',
  id: titresMSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
}

const titresR = {
  name: 'titres-r',
  id: titresRSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
}

const titresS = {
  name: 'titres-s',
  id: titresSSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
}

const titresW = {
  name: 'titres-w',
  id: titresWSpreadsheetId,
  tables: titresTables,
  prefixFileName: true
}

const titresReprise =
  // feuille optionnelle pour la reprise de données
  {
    name: 'titres-reprise',
    id: titresRepriseSpreadsheetId,
    tables: titresTables,
    prefixFileName: true
  }

const metas = {
  name: 'metas',
  id: metasSpreadsheetId,
  tables: [
    { name: 'domaines' },
    { name: 'titres_types' },
    { name: 'titres_types_types' },
    { name: 'titres_statuts' },
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
    { name: 'geo_systemes' },
    { name: 'devises' },
    { name: 'unites' },
    { name: 'administrations_types' },
    { name: 'permissions' },
    { name: 'documents_types' },
    { name: 'references_types' }
  ]
}

const substances = {
  name: 'substances',
  id: substancesSpreadsheetId,
  tables: [
    { name: 'substances' },
    { name: 'substances_legales' },
    { name: 'substances_legales_codes' },
    { name: 'substances__substances_legales' }
  ]
}

const territoires = {
  name: 'territoires',
  id: territoiresSpreadsheetId,
  tables: [
    { name: 'pays' },
    { name: 'regions' },
    { name: 'departements' },
    { name: 'communes' }
  ]
}

const calendrier = {
  name: 'calendrier',
  id: calendrierSpreadsheetId,
  tables: [
    { name: 'frequences' },
    { name: 'annees' },
    { name: 'trimestres' },
    { name: 'mois' }
  ]
}

const entreprises = {
  name: 'entreprises',
  id: entreprisesSpreadsheetId,
  tables: [{ name: 'entreprises' }, { name: 'entreprises_etablissements' }]
}

const administrations = {
  name: 'administrations',
  id: administrationsSpreadsheetId,
  tables: [{ name: 'administrations' }]
}

const administrationsAutorisations = {
  name: 'administrations-autorisations',
  id: administrationsAutorisationsSpreadsheetId,
  tables: [
    { name: 'a__titres_types__administrations' },
    { name: 'r__titres_types__titres_statuts__administrations' },
    { name: 'r__titres_types__etapes_types__administrations' }
  ]
}

const utilisateurs = {
  name: 'utilisateurs',
  id: utilisateursSpreadsheetId,
  tables: [
    { name: 'utilisateurs', cb: { preferences: JSON.parse } },
    { name: 'utilisateurs__entreprises' },
    { name: 'utilisateurs__administrations' }
  ]
}

const metasActivites = {
  name: 'metas-activites',
  id: metasActivitesSpreadsheetId,
  tables: [
    { name: 'activites_types', cb: { sections: JSON.parse } },
    { name: 'activites_statuts' },
    { name: 'titres_types__activites_types' },
    { name: 'activites_types__pays' },
    { name: 'activites_types__administrations' }
  ]
}

const titresActivites = {
  name: 'titres-activites',
  id: titresActivitesSpreadsheetId,
  tables: [{ name: 'titres_activites', cb: { contenu: JSON.parse } }]
}

const autorisations = {
  name: 'autorisations',
  id: autorisationsSpreadsheetId,
  tables: [
    { name: 'a__domaines' },
    { name: 'a__titres_types__titres_statuts' },
    { name: 'a__etapes_types' }
  ]
}

const globales = {
  name: 'globales',
  id: globalesSpreadsheetId,
  tables: [{ name: 'globales' }]
}

const spreadsheets = [
  titresC,
  titresF,
  titresG,
  titresH,
  titresM,
  titresR,
  titresS,
  titresW,
  titresReprise,
  metas,
  substances,
  territoires,
  calendrier,
  entreprises,
  administrations,
  administrationsAutorisations,
  utilisateurs,
  metasActivites,
  titresActivites,
  autorisations,
  globales
]

export default spreadsheets
