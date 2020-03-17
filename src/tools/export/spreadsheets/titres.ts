import {
  ITitre,
  ICoordonnees,
  IContenu,
  ITitrePropsTitreEtapesIds
} from '../../../types'
import { ISpreadsheet } from '../types'
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

const get = async (domaineId: string) => {
  const titres = await titresGet({
    typesIds: undefined,
    domainesIds: [domaineId],
    statutsIds: undefined,
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
      'substancesTitreEtapeId',
      'communesTitreEtapeId',
      'surfaceTitreEtapeId',
      'propsTitreEtapesIds'
    ],
    callbacks: {
      propsTitreEtapesIds: (v: ITitrePropsTitreEtapesIds) => JSON.stringify(v)
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
      { id: 'parentTitreDemarcheId', parentKey: 'id' },
      { id: 'enfantTitreDemarcheId', key: 'id' }
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
      'contenu'
    ],
    parents: ['demarches', 'etapes'],
    callbacks: {
      contenu: (v: IContenu) => JSON.stringify(v)
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
      coordonnees: (v: ICoordonnees) => `${v.x},${v.y}`
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
      coordonnees: (v: ICoordonnees) => `${v.x},${v.y}`
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
    columns: [{ id: 'titreEtapeId', parentKey: 'id' }, 'ordre', 'connexe'],
    parents: ['demarches', 'etapes', 'substances']
  },
  {
    id: 11,
    name: 'titresTitulaires',
    columns: [
      { id: 'titreEtapeId', parentKey: 'id' },
      { id: 'entrepriseId', key: 'id' },
      'operateur'
    ],
    parents: ['demarches', 'etapes', 'titulaires']
  },
  {
    id: 12,
    name: 'titresAmodiataires',
    columns: [
      { id: 'titreEtapeId', parentKey: 'id' },
      { id: 'entrepriseId', key: 'id' },
      'operateur'
    ],
    parents: ['demarches', 'etapes', 'amodiataires']
  },
  {
    id: 13,
    name: 'titresAdministrationsGestionnaires',
    columns: [
      { id: 'titreId', parentKey: 'id' },
      { id: 'administrationId', key: 'id' },
      'associee'
    ],
    parents: ['administrationsGestionnaires']
  },
  {
    id: 14,
    name: 'titresAdministrationsLocales',
    columns: [
      { id: 'titreEtapeId', parentKey: 'id' },
      { id: 'administrationId', key: 'id' },
      'associee',
      'coordinateur'
    ],
    parents: ['demarches', 'etapes', 'administrations']
  },
  {
    id: 15,
    name: 'titresUtilisateurs',
    columns: [
      { id: 'titreEtapeId', parentKey: 'id' },
      { id: 'utilisateurId', key: 'id' }
    ],
    parents: ['demarches', 'etapes', 'utilisateurs']
  },
  {
    id: 16,
    name: 'titresCommunes',
    columns: [
      { id: 'titreEtapeId', parentKey: 'id' },
      { id: 'communeId', key: 'id' },
      'surface'
    ],
    parents: ['demarches', 'etapes', 'communes']
  },
  {
    id: 17,
    name: 'titresIncertitudes',
    columns: [
      { id: 'titreEtapeId', parentKey: 'id' },
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
] as ISpreadsheet<ITitre>[]

export default spreadsheets
