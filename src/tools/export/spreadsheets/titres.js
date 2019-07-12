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
      'references',
      'dateDebut',
      'dateFin',
      'dateDemande',
      'activitesDeposees',
      'activitesEnConstruction',
      'activitesAbsentes'
    ],
    callbacks: {
      references: v =>
        JSON.stringify(
          v.reduce((r, { type, valeur }) => ({ ...r, [type]: valeur }), {})
        ),
      dateDebut: v => dateFormat(v, 'yyyy-mm-dd'),
      dateFin: v => dateFormat(v, 'yyyy-mm-dd'),
      dateDemande: v => dateFormat(v, 'yyyy-mm-dd')
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
  {
    id: 3,
    name: 'titresDemarchesLiens',
    columns: [
      { key: 'parent.id', value: 'parentTitreDemarcheId' },
      { key: 'id', value: 'enfantTitreDemarcheId' }
    ],
    parents: ['demarches', 'parents']
  },
  {
    id: 4,
    name: 'titresPhases',
    columns: ['titreDemarcheId', 'statutId', 'dateDebut', 'dateFin'],
    parents: ['demarches', 'phase'],
    callbacks: {
      dateDebut: v => dateFormat(v, 'yyyy-mm-dd'),
      dateFin: v => dateFormat(v, 'yyyy-mm-dd')
    }
  },
  {
    id: 5,
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
      'visas',
      'engagement',
      'engagementDeviseId',
      'contenu'
    ],
    parents: ['demarches', 'etapes'],
    callbacks: {
      dateDebut: v => dateFormat(v, 'yyyy-mm-dd'),
      dateFin: v => dateFormat(v, 'yyyy-mm-dd'),
      date: v => dateFormat(v, 'yyyy-mm-dd'),
      visas: v => JSON.stringify(v),
      contenu: v => JSON.stringify(v)
    }
  },
  {
    id: 6,
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
    id: 7,
    name: 'titresPointsReferences',
    columns: ['id', 'titrePointId', 'geoSystemeId', 'coordonnees'],
    parents: ['demarches', 'etapes', 'points', 'references'],
    callbacks: {
      coordonnees: v => `${v.x},${v.y}`
    }
  },
  {
    id: 8,
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
      'fichier',
      'public'
    ],
    parents: ['demarches', 'etapes', 'documents']
  },
  {
    id: 9,
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
    id: 10,
    name: 'titresTitulaires',
    columns: [
      { key: 'parent.id', value: 'titreEtapeId' },
      { key: 'id', value: 'entrepriseId' },
      'operateur'
    ],
    parents: ['demarches', 'etapes', 'titulaires']
  },
  {
    id: 11,
    name: 'titresAmodiataires',
    columns: [
      { key: 'parent.id', value: 'titreEtapeId' },
      { key: 'id', value: 'entrepriseId' },
      'operateur'
    ],
    parents: ['demarches', 'etapes', 'amodiataires']
  },
  {
    id: 12,
    name: 'titresAdministrations',
    columns: [
      { key: 'parent.id', value: 'titreEtapeId' },
      { key: 'id', value: 'administrationId' },
      'coordinateur'
    ],
    parents: ['demarches', 'etapes', 'administrations']
  },
  {
    id: 13,
    name: 'titresUtilisateurs',
    columns: [
      { key: 'parent.id', value: 'titreEtapeId' },
      { key: 'id', value: 'utilisateurId' }
    ],
    parents: ['demarches', 'etapes', 'utilisateurs']
  },
  {
    id: 14,
    name: 'titresEmprises',
    columns: [
      { key: 'parent.id', value: 'titreEtapeId' },
      { key: 'id', value: 'empriseId' }
    ],
    parents: ['demarches', 'etapes', 'emprises']
  },
  {
    id: 15,
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
