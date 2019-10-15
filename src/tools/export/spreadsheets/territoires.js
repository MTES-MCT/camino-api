import { paysGet } from '../../../database/queries/territoires'

const id = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TERRITOIRES

const get = () => paysGet({})

const tables = [
  {
    id: 1,
    name: 'pays',
    columns: ['id', 'nom', 'timezone']
  },
  {
    id: 2,
    name: 'regions',
    columns: ['id', 'nom', 'paysId', 'cheflieuId'],
    parents: ['regions']
  },
  {
    id: 3,
    name: 'departements',
    columns: ['id', 'nom', 'regionId', 'cheflieuId'],
    parents: ['regions', 'departements']
  },
  {
    id: 4,
    name: 'communes',
    columns: ['id', 'nom', 'departementId'],
    parents: ['regions', 'departements', 'communes']
  }
]

const spreadsheet = {
  id,
  name: 'territoires',
  get,
  tables
}

export default spreadsheet
