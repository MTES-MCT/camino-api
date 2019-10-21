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

const metasSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_METAS
const territoiresSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_TERRITOIRES
const calendrierSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_CALENDRIER
const substancesSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_SUBSTANCES

const entreprisesSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_ENTREPRISES
const administrationsSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_ADMINISTRATIONS
const utilisateursSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_UTILISATEURS

const restrictionsSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_RESTRICTIONS

const metasActivitesSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_METAS_ACTIVITES
const titresActivitesSpreadsheetId =
  process.env.GOOGLE_SPREADSHEET_ID_TITRES_ACTIVITES

const titresTables = [
  { name: 'titres', cb: { references: JSON.parse } },
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
  { name: 'titres_administrations_centrales' },
  { name: 'titres_administrations_locales' },
  { name: 'titres_amodiataires' },
  { name: 'titres_incertitudes' }
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

  // feuille optionnelle pour la reprise de données
  {
    name: 'titres-reprise',
    id: titresRepriseSpreadsheetId,
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
      { name: 'etapes_types', cb: { sections: JSON.parse } },
      { name: 'etapes_statuts' },
      { name: 'etapes_types__etapes_statuts' },
      { name: 'demarches_types__etapes_types' },
      { name: 'geo_systemes' },
      { name: 'devises' },
      { name: 'unites' },
      { name: 'administrations_types' },
<<<<<<< HEAD
      { name: 'permissions' },
<<<<<<< HEAD
      { name: 'documents_types' }
=======
      { name: 'references_types' }
>>>>>>> fix: affiche les dates correctement quelque soit le fuseau horaire
=======
      { name: 'permissions' } // todo : à rajouter après le passage du script et du migrate
      // { name: 'permissions' },
      // { name: 'references_types' }
>>>>>>> feat(api): limite la liste des types de références métier
    ]
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
    name: 'territoires',
    id: territoiresSpreadsheetId,
    tables: [
      { name: 'pays' },
      { name: 'regions' },
      { name: 'departements' },
      { name: 'communes' }
    ]
  },
  {
    name: 'calendrier',
    id: calendrierSpreadsheetId,
    tables: [{ name: 'frequences' }, { name: 'trimestres' }, { name: 'mois' }]
  },

  {
    name: 'entreprises',
    id: entreprisesSpreadsheetId,
    tables: [{ name: 'entreprises' }, { name: 'entreprises_etablissements' }]
  },
  {
    name: 'administrations',
    id: administrationsSpreadsheetId,
    tables: [{ name: 'administrations' }, { name: 'administrations__domaines' }]
  },
  {
    name: 'utilisateurs',
    id: utilisateursSpreadsheetId,
    tables: [
      { name: 'utilisateurs', cb: { preferences: JSON.parse } },
      { name: 'utilisateurs__entreprises' },
      { name: 'utilisateurs__administrations' }
    ]
  },

  {
    name: 'metas-activites',
    id: metasActivitesSpreadsheetId,
    tables: [
      { name: 'activites_types', cb: { sections: JSON.parse } },
      { name: 'activites_statuts' },
      { name: 'activites_types__types' },
      { name: 'activites_types__pays' }
    ]
  },
  {
    name: 'titres-activites',
    id: titresActivitesSpreadsheetId,
    tables: [{ name: 'titres_activites', cb: { contenu: JSON.parse } }]
  },

  {
    name: 'restrictions',
    id: restrictionsSpreadsheetId,
    tables: [
      { name: 'restrictions__domaines' },
      { name: 'restrictions__types__administrations' },
      { name: 'restrictions__types__statuts' },
      { name: 'restrictions__types__statuts__administrations' },
      { name: 'restrictions__etapes_types' },
      { name: 'restrictions__etapes_types__administrations' }
    ]
  }
]

export default spreadsheets
