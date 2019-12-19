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
      'abreviation',
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
  },
  {
    id: 3,
    name: 'administrations__domaines',
    columns: [
      { key: 'id', value: 'domaineId' },
      { key: 'parent.id', value: 'administrationId' }
    ],
    parents: ['domaines']
  }
]

const spreadsheet = {
  id,
  name: 'administrations',
  get,
  tables
}

export default spreadsheet
