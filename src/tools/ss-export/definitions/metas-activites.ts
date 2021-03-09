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
      'ordre',
      'email'
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
      { id: 'activiteTypeId', parentKey: 'id' },
      { id: 'paysId', key: 'id' }
    ],
    parents: ['pays']
  },
  {
    id: 5,
    name: 'activitesTypes__documentsTypes',
    columns: [
      { id: 'activiteTypeId', parentKey: 'id' },
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
