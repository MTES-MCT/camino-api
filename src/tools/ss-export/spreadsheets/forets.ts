import { ISpreadsheet } from '../_types'
import { foretsGet } from '../../../database/queries/territoires'
import { IForet } from '../../../types'

const id = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_FORETS

const get = () => foretsGet()

const tables = [
  {
    id: 1,
    name: 'forets',
    columns: ['id', 'nom']
  }
]

const spreadsheet = {
  id,
  name: 'forets',
  get,
  tables
} as ISpreadsheet<IForet>

export default spreadsheet
