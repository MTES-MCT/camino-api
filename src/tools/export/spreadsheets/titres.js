import { titresGet } from '../../../database/queries/titres'

const titresCSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_C
const titresFSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_F
const titresGSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_G
const titresHSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_H
const titresMSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_M
const titresRSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_R
const titresSSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_S
const titresWSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_W
const titresIdsFilter = process.env.GOOGLE_EXPORT_TITRES_IDS
  ? process.env.GOOGLE_EXPORT_TITRES_IDS.split(',')
  : []

// const metasSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_METAS
// const entreprisesSpreadsheetId =
//   process.env.GOOGLE_SPREADSHEET_ID_EXPORT_ENTREPRISES
// const administrationsSpreadsheetId =
//   process.env.GOOGLE_SPREADSHEET_ID_EXPORT_ADMINISTRATIONS
// const substancesSpreadsheetId =
//   process.env.GOOGLE_SPREADSHEET_ID_EXPORT_SUBSTANCES

const get = async domaineId => {
  const titres = await titresGet({
    typeIds: undefined,
    domaineIds: [domaineId],
    statutIds: undefined,
    substances: undefined,
    noms: undefined
  })

  return titresIdsFilter.length > 0
    ? titres.filter(t => titresIdsFilter.includes(t.id))
    : titres
}

const tables = [
  {
    id: 1,
    name: 'titres',
    columns: [
      'id',
      'nom',
      'typeId',
      'domaineId',
      'statutId',
      'dateDebut',
      'dateFin',
      'dateDemande',
      'pointsTitreEtapeId',
      'titulairesTitreEtapeId',
      'amodiatairesTitreEtapeId',
      'administrationsTitreEtapeId',
      'surfaceTitreEtapeId',
      'volumeTitreEtapeId',
      'volumeUniteIdTitreEtapeId',
      'substancesTitreEtapeId',
      'communesTitreEtapeId',
      'engagementTitreEtapeId',
      'engagementDeviseIdTitreEtapeId'
    ],
    callbacks: {
      references: v =>
        JSON.stringify(
          v.reduce((r, { type, valeur }) => {
            r[type] = valeur

            return r
          }, {})
        )
    }
  },
  {
    id: 2,
    name: 'titresReferences',
    columns: ['titreId', 'typeId', 'nom'],
    parents: ['references']
  },
  {
    id: 3,
    name: 'titresDemarches',
    columns: [
      'id',
      'typeId',
      'titreId',
      'statutId',
      'ordre',
      'annulationTitreDemarcheId'
    ],
    parents: ['demarches']
  },
  {
    id: 4,
    name: 'titresDemarchesLiens',
    columns: [
      { key: 'parent.id', value: 'parentTitreDemarcheId' },
      { key: 'id', value: 'enfantTitreDemarcheId' }
    ],
    parents: ['demarches', 'parents']
  },
  {
    id: 5,
    name: 'titresPhases',
    columns: ['titreDemarcheId', 'statutId', 'dateDebut', 'dateFin'],
    parents: ['demarches', 'phase']
  },
  {
    id: 6,
    name: 'titresEtapes',
    columns: [
      'id',
      'titreDemarcheId',
      'typeId',
      'statutId',
      'ordre',
      'date',
      'dateDebut',
      'dateFin',
      'duree',
      'surface',
      'volume',
      'volumeUniteId',
      'engagement',
      'engagementDeviseId',
      'contenu'
    ],
    parents: ['demarches', 'etapes'],
    callbacks: {
      contenu: v => JSON.stringify(v)
    }
  },
  {
    id: 7,
    name: 'titresPoints',
    columns: [
      'id',
      'titreEtapeId',
      'coordonnees',
      'groupe',
      'contour',
      'point',
      'nom',
      'description',
      'subsidiaire',
      'securite'
    ],
    parents: ['demarches', 'etapes', 'points'],
    callbacks: {
      coordonnees: v => `${v.x},${v.y}`
    }
  },
  {
    id: 8,
    name: 'titresPointsReferences',
    columns: [
      'id',
      'titrePointId',
      'geoSystemeId',
      'coordonnees',
      'opposable',
      'uniteId'
    ],
    parents: ['demarches', 'etapes', 'points', 'references'],
    callbacks: {
      coordonnees: v => `${v.x},${v.y}`
    }
  },
  {
    id: 9,
    name: 'titresDocuments',
    columns: [
      'id',
      'titreEtapeId',
      'typeId',
      'jorf',
      'nor',
      'nom',
      'url',
      'uri',
      'fichier',
      'fichierTypeId',
      'public'
    ],
    parents: ['demarches', 'etapes', 'documents']
  },
  {
    id: 10,
    name: 'titresSubstances',
    columns: [
      { key: 'parent.id', value: 'titreEtapeId' },
      { key: 'id', value: 'substanceId' },
      'ordre',
      'connexe'
    ],
    parents: ['demarches', 'etapes', 'substances']
  },
  {
    id: 11,
    name: 'titresTitulaires',
    columns: [
      { key: 'parent.id', value: 'titreEtapeId' },
      { key: 'id', value: 'entrepriseId' },
      'operateur'
    ],
    parents: ['demarches', 'etapes', 'titulaires']
  },
  {
    id: 12,
    name: 'titresAmodiataires',
    columns: [
      { key: 'parent.id', value: 'titreEtapeId' },
      { key: 'id', value: 'entrepriseId' },
      'operateur'
    ],
    parents: ['demarches', 'etapes', 'amodiataires']
  },
  {
    id: 13,
    name: 'titresAdministrationsGestionnaires',
    columns: [
      { key: 'parent.id', value: 'titreId' },
      { key: 'id', value: 'administrationId' },
      'associee'
    ],
    parents: ['administrationsGestionnaires']
  },
  {
    id: 14,
    name: 'titresAdministrationsLocales',
    columns: [
      { key: 'parent.id', value: 'titreEtapeId' },
      { key: 'id', value: 'administrationId' },
      'associee',
      'coordinateur'
    ],
    parents: ['demarches', 'etapes', 'administrations']
  },
  {
    id: 15,
    name: 'titresUtilisateurs',
    columns: [
      { key: 'parent.id', value: 'titreEtapeId' },
      { key: 'id', value: 'utilisateurId' }
    ],
    parents: ['demarches', 'etapes', 'utilisateurs']
  },
  {
    id: 16,
    name: 'titresCommunes',
    columns: [
      { key: 'parent.id', value: 'titreEtapeId' },
      { key: 'id', value: 'communeId' },
      'surface'
    ],
    parents: ['demarches', 'etapes', 'communes']
  },
  {
    id: 17,
    name: 'titresIncertitudes',
    columns: [
      { key: 'parent.id', value: 'titreEtapeId' },
      'date',
      'dateDebut',
      'dateFin',
      'duree',
      'surface',
      'volume',
      'engagement',
      'points',
      'substances',
      'titulaires',
      'amodiataires',
      'administrations'
    ],
    parents: ['demarches', 'etapes', 'incertitudes']
  }
]

const spreadsheets = [
  {
    name: 'titres-c',
    id: titresCSpreadsheetId,
    get: async () => get('c'),
    tables
  },
  {
    name: 'titres-f',
    id: titresFSpreadsheetId,
    get: async () => get('f'),
    tables
  },
  {
    name: 'titres-g',
    id: titresGSpreadsheetId,
    get: async () => get('g'),
    tables
  },
  {
    name: 'titres-h',
    id: titresHSpreadsheetId,
    get: async () => get('h'),
    tables
  },
  {
    name: 'titres-m',
    id: titresMSpreadsheetId,
    get: async () => get('m'),
    tables
  },
  {
    name: 'titres-r',
    id: titresRSpreadsheetId,
    get: async () => get('r'),
    tables
  },
  {
    name: 'titres-s',
    id: titresSSpreadsheetId,
    get: async () => get('s'),
    tables
  },
  {
    name: 'titres-w',
    id: titresWSpreadsheetId,
    get: async () => get('w'),
    tables
  }
]

export default spreadsheets
