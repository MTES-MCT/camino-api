import { administrationsGet } from '../../../database/queries/administrations'

const id = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_ADMINISTRATIONS

const get = async () =>
  administrationsGet({
    noms: undefined,
    entrepriseIds: undefined,
    administrationIds: undefined,
    permissionIds: undefined
  })

const tables = [
  {
    id: 1,
    name: 'administrations',
    columns: [
      'id',
      'typeId',
      'nom',
      'service',
      'url',
      'email',
      'telephone',
      'adresse1',
      'adresse2',
      'codePostal',
      'commune',
      'cedex',
      'departementId',
      'regionId'
    ]
  }
]

const spreadsheet = {
  id,
  name: 'administrations',
  get,
  tables
}

export default spreadsheet
