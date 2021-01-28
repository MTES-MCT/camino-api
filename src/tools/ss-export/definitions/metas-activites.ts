import { IPays, ISection } from '../../../types'
import { ISpreadsheet } from '../_types'
import { activitesTypesGet } from '../../../database/queries/metas-activites'

const id = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_METAS_ACTIVITES

const get = () => activitesTypesGet({}, 'super')

const tables = [
  {
    id: 1,
    name: 'activitesTypes',
    columns: [
      'id',
      'nom',
      'frequenceId',
      'dateDebut',
      'delaiMois',
      'sections',
      'satisfactionUrl',
      'ordre'
    ],
    callbacks: {
      sections: (v: ISection) => JSON.stringify(v)
    }
  },
  {
    id: 2,
    name: 'titresTypes__activitesTypes',
    columns: [
      { id: 'titreTypeId', key: 'id' },
      { id: 'activiteTypeId', parentKey: 'id' }
    ],
    parents: ['titresTypes']
  },
  {
    id: 3,
    name: 'activitesTypes__pays',
    columns: [
      { id: 'activitesTypeId', parentKey: 'id' },
      { id: 'paysId', key: 'id' }
    ],
    parents: ['pays']
  },
  {
    id: 4,
    name: 'activitesTypes__administrations',
    columns: [
      { id: 'activitesTypeId', parentKey: 'id' },
      { id: 'administrationId', key: 'id' },
      'modification'
    ],
    parents: ['administrations']
  },
  {
    id: 5,
    name: 'activitesTypes__documentsTypes',
    columns: [
      { id: 'activitesTypeId', parentKey: 'id' },
      { id: 'documentTypeId', key: 'id' },
      'optionnel'
    ],
    parents: ['documentsTypes']
  }
]

const spreadsheet = {
  id,
  name: 'activitesTypes',
  get,
  tables
} as ISpreadsheet<IPays>

export default spreadsheet
