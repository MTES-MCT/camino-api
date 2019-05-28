import * as dateFormat from 'dateformat'

import { titresGet } from '../../../database/queries/titres'

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
// const administrationsSpreadsheetId =
//   process.env.GOOGLE_SPREADSHEET_ID_EXPORT_ADMINISTRATIONS
// const substancesSpreadsheetId =
//   process.env.GOOGLE_SPREADSHEET_ID_EXPORT_SUBSTANCES

const get = domaineId =>
  titresGet({
    typeIds: undefined,
    domaineIds: [domaineId],
    statutIds: undefined,
    substances: undefined,
    noms: undefined
  })

const tables = [
  {
    id: 1,
    name: 'titres',
    columns: ['id', 'nom', 'typeId', 'domaineId', 'statutId', 'references'],
    callbacks: {
      references: v => JSON.stringify(v)
    }
  },
  {
    id: 2,
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
  // {
  //   name: 'titresDemarchesLiens',
  //   columns: ['parentTitreDemarcheId', 'enfantTitreDemarcheId'],
  //   parents: ['demarches']
  // },
  {
    id: 3,
    name: 'titresPhases',
    columns: ['titreDemarcheId', 'statutId', 'dateDebut', 'dateFin'],
    parents: ['demarches', 'phase'],
    callbacks: {
      dateDebut: v => dateFormat(v, 'yyyy-mm-dd'),
      dateFin: v => dateFormat(v, 'yyyy-mm-dd')
    }
  },
  {
    id: 4,
    name: 'titresEtapes',
    columns: [
      'id',
      'titreDemarcheId',
      'typeId',
      'statutId',
      'ordre',
      'date',
      'dateDebut',
      'duree',
      'dateFin',
      'surface',
      'visas',
      'engagement',
      'engagementDeviseId',
      'engagementVolume',
      'engagementVolumeUniteId',
      'sourceIndisponible'
    ],
    parents: ['demarches', 'etapes'],
    callbacks: {
      dateDebut: v => dateFormat(v, 'yyyy-mm-dd'),
      dateFin: v => dateFormat(v, 'yyyy-mm-dd'),
      date: v => dateFormat(v, 'yyyy-mm-dd'),
      visas: v => JSON.stringify(v)
    }
  },
  {
    id: 5,
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
      'securite'
    ],
    parents: ['demarches', 'etapes', 'points'],
    callbacks: {
      coordonnees: v => `${v.x},${v.y}`
    }
  },
  {
    id: 6,
    name: 'titresPointsReferences',
    columns: ['id', 'titrePointId', 'geoSystemeId', 'coordonnees'],
    parents: ['demarches', 'etapes', 'points', 'references'],
    callbacks: {
      coordonnees: v => `${v.x},${v.y}`
    }
  },
  {
    id: 7,
    name: 'titresDocuments',
    columns: [
      'id',
      'titreEtapeId',
      'type',
      'jorf',
      'nor',
      'nom',
      'url',
      'uri',
      'fichier'
    ],
    parents: ['demarches', 'etapes', 'documents']
  },
  {
    id: 8,
    name: 'titresSubstances',
    columns: ['titreEtapeId', 'substanceId', 'connexe', 'ordre'],
    parents: ['demarches', 'etapes', 'titresSubstances']
  },
  {
    id: 9,
    name: 'titresTitulaires',
    columns: ['titreEtapeId', 'entrepriseId', 'operateur'],
    parents: ['demarches', 'etapes', 'titresTitulaires']
  },
  {
    id: 10,
    name: 'titresAmodiataires',
    columns: ['titreEtapeId', 'entrepriseId'],
    parents: ['demarches', 'etapes', 'titresAmodiataires']
  },
  {
    id: 11,
    name: 'titresAdministrations',
    columns: ['titreEtapeId', 'administrationId', 'coordinateur'],
    parents: ['demarches', 'etapes', 'titresAdministrations']
  },
  {
    id: 12,
    name: 'titresUtilisateurs',
    columns: ['titreEtapeId', 'utilisateurId'],
    parents: ['demarches', 'etapes', 'titresUtilisateurs']
  },
  {
    id: 13,
    name: 'titresEmprises',
    columns: ['titreEtapeId', 'empriseId'],
    parents: ['demarches', 'etapes', 'titresEmprises']
  },
  {
    id: 14,
    name: 'titresIncertitudes',
    columns: [
      'titreEtapeId',
      'date',
      'dateDebut',
      'dateFin',
      'duree',
      'surface',
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
    get: get('c'),
    tables
  },
  {
    name: 'titres-f',
    id: titresFSpreadsheetId,
    get: get('f'),
    tables
  },
  {
    name: 'titres-g',
    id: titresGSpreadsheetId,
    get: get('g'),
    tables
  },
  {
    name: 'titres-h',
    id: titresHSpreadsheetId,
    get: get('h'),
    tables
  },
  {
    name: 'titres-m',
    id: titresMSpreadsheetId,
    get: get('m'),
    tables
  },
  {
    name: 'titres-r',
    id: titresRSpreadsheetId,
    get: get('r'),
    tables
  },
  {
    name: 'titres-s',
    id: titresSSpreadsheetId,
    get: get('s'),
    tables
  },
  {
    name: 'titres-w',
    id: titresWSpreadsheetId,
    get: get('w'),
    tables
  }
]

export default spreadsheets
