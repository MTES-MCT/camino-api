import { ISpreadsheetMultiple } from '../_types'
import { ISection } from '../../../types'

import {
  definitionsGet,
  administrationsTypesGet,
  demarchesStatutsGet,
  demarchesTypesGet,
  devisesGet,
  documentsTypesGet,
  domainesGet,
  etapesStatutsGet,
  etapesTypesEtapesStatutsGet,
  etapesTypesGet,
  geoSystemesGet,
  permissionsGet,
  phasesStatutsGet,
  referencesTypesGet,
  titresStatutsGet,
  titresTypesDemarchesTypesEtapesTypesGet,
  titresTypesDemarchesTypesGet,
  titresTypesGet,
  titresTypesTitresStatutsGet,
  titresTypesTypesGet,
  travauxTypesEtapesTypesGet,
  travauxTypesGet,
  unitesGet
} from '../../../database/queries/metas'

const id = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_METAS

const tables = [
  {
    id: 1,
    name: 'definitions',
    columns: ['id', 'nom', 'slug', 'table', 'description', 'ordre']
  },
  {
    id: 2,
    name: 'domaines',
    columns: ['id', 'nom', 'description', 'ordre']
  },
  {
    id: 3,
    name: 'titresTypesTypes',
    columns: ['id', 'nom', 'description', 'ordre']
  },
  {
    id: 4,
    name: 'titresTypes',
    columns: ['id', 'domaineId', 'typeId', 'propsEtapesTypes', 'archive'],
    callbacks: {
      propsEtapesTypes: (v: ISection) => JSON.stringify(v)
    }
  },
  {
    id: 5,
    name: 'titresStatuts',
    columns: ['id', 'nom', 'description', 'couleur', 'ordre']
  },
  {
    id: 6,
    name: 'titresTypes__titresStatuts',
    columns: ['titreTypeId', 'titreStatutId', 'publicLecture']
  },
  {
    id: 7,
    name: 'demarchesTypes',
    columns: [
      'id',
      'nom',
      'description',
      'ordre',
      'duree',
      'points',
      'substances',
      'titulaires',
      'exception',
      'renouvelable',
      'auto'
    ]
  },
  {
    id: 8,
    name: 'demarchesStatuts',
    columns: ['id', 'nom', 'description', 'couleur', 'ordre']
  },
  {
    id: 9,
    name: 'titresTypes__demarchesTypes',
    columns: [
      'titreTypeId',
      'demarcheTypeId',
      'dureeMax',
      'acceptationImplicite',
      'delaiImplicite',
      'delaiRecours',
      'legaleRef',
      'legalLien',
      'dateDebut',
      'dateFin'
    ]
  },
  {
    id: 10,
    name: 'phasesStatuts',
    columns: ['id', 'nom', 'couleur']
  },
  {
    id: 11,
    name: 'etapesTypes',
    columns: [
      'id',
      'nom',
      'description',
      'ordre',
      'sections',
      'legaleRef',
      'legalLien',
      'dateDebut',
      'dateFin',
      'fondamentale',
      'unique',
      'acceptationAuto',
      'publicLecture',
      'entreprisesLecture'
    ],
    callbacks: {
      sections: (v: ISection) => JSON.stringify(v)
    }
  },
  {
    id: 12,
    name: 'titresTypes__demarchesTypes__etapesTypes',
    columns: [
      'titreTypeId',
      'demarcheTypeId',
      'etapeTypeId',
      'ordre',
      'sections'
    ],
    callbacks: {
      sections: (v: ISection) => JSON.stringify(v)
    }
  },
  {
    id: 13,
    name: 'etapesStatuts',
    columns: ['id', 'nom', 'description', 'couleur', 'ordre']
  },
  {
    id: 14,
    name: 'etapesTypes__etapesStatuts',
    columns: ['etapeTypeId', 'etapeStatutId', 'ordre']
  },
  {
    id: 15,
    name: 'travauxTypes',
    columns: ['id', 'nom', 'description', 'ordre']
  },
  {
    id: 16,
    name: 'travauxTypes__etapesTypes',
    columns: ['travauxTypeId', 'etapeTypeId', 'ordre']
  },
  {
    id: 17,
    name: 'geoSystemes',
    columns: ['id', 'nom', 'ordre', 'uniteId', 'zone', 'definitionProj4']
  },
  {
    id: 18,
    name: 'devises',
    columns: ['id', 'nom', 'ordre']
  },
  {
    id: 19,
    name: 'unites',
    columns: ['id', 'nom', 'symbole']
  },
  {
    id: 20,
    name: 'administrationsTypes',
    columns: ['id', 'nom', 'ordre']
  },
  {
    id: 21,
    name: 'permissions',
    columns: ['id', 'nom', 'ordre']
  },
  {
    id: 22,
    name: 'documentsTypes',
    columns: ['id', 'nom', 'repertoire']
  },
  {
    id: 23,
    name: 'referencesTypes',
    columns: ['id', 'nom']
  }
]

const definition = {
  id,
  name: 'metas',
  gets: {
    definitions: async () => definitionsGet(),
    domaines: async () => domainesGet(null as never, { fields: {} }, 'super'),
    titresTypesTypes: async () => titresTypesTypesGet(),
    titresTypes: async () => titresTypesGet(null as never, { fields: {} }),
    titresStatuts: async () => titresStatutsGet('super'),
    titresTypes__titresStatuts: async () => titresTypesTitresStatutsGet(),
    demarchesTypes: async () => demarchesTypesGet({}, { fields: {} }, 'super'),
    demarchesStatuts: async () => demarchesStatutsGet(),
    titresTypes__demarchesTypes: async () => titresTypesDemarchesTypesGet(),
    phasesStatuts: async () => phasesStatutsGet(),
    etapesTypes: async () => etapesTypesGet({}, { fields: {} }, 'super'),
    titresTypes__demarchesTypes__etapesTypes: async () =>
      titresTypesDemarchesTypesEtapesTypesGet(),
    etapesStatuts: async () => etapesStatutsGet(),
    etapesTypes__etapesStatuts: async () => etapesTypesEtapesStatutsGet(),
    travauxTypes: async () => travauxTypesGet({}, { fields: {} }, 'super'),
    travauxTypes__etapesTypes: async () => travauxTypesEtapesTypesGet(),
    geoSystemes: async () => geoSystemesGet(),
    devises: async () => devisesGet(),
    unites: async () => unitesGet(),
    administrationsTypes: async () => administrationsTypesGet(),
    permissions: async () =>
      permissionsGet(null as never, null as never, 'super'),
    documentsTypes: async () => documentsTypesGet({}),
    referencesTypes: async () => referencesTypesGet()
  },
  tables
} as ISpreadsheetMultiple

export default definition
