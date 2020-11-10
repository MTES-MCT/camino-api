import { ISpreadsheet } from '../_types'
import { IAdministration } from '../../../types'
import { administrationsGet } from '../../../database/queries/administrations'

const id = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_ADMINISTRATIONS

const get = async () => administrationsGet({ noms: undefined }, {}, 'super')

const tables = [
  {
    id: 1,
    name: 'administrations',
    columns: [
      'id',
      'typeId',
      'nom',
      'service',
      'abreviation',
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
    id: 2,
    name: 'administrations__titresTypes',
    columns: [
      { id: 'administrationId', parentKey: 'id' },
      { id: 'titreTypeId', key: 'id' },
      'gestionnaire',
      'associee'
    ],
    parents: ['titresTypes']
  },
  {
    id: 3,
    name: 'administrations__titresTypes__titresStatuts',
    columns: [
      { id: 'administrationId', parentKey: 'id' },
      'titreTypeId',
      'titreStatutId',
      'titresModificationInterdit',
      'demarchesModificationInterdit',
      'etapesModificationInterdit'
    ],
    parents: ['titresTypesTitresStatuts']
  },
  {
    id: 4,
    name: 'administrations__titresTypes__etapesTypes',
    columns: [
      { id: 'administrationId', parentKey: 'id' },
      'titreTypeId',
      'etapeTypeId',
      'lectureInterdit',
      'creationInterdit',
      'modificationInterdit'
    ],
    parents: ['titresTypesEtapesTypes']
  }
]

const spreadsheet = {
  id,
  name: 'administrations',
  get,
  tables
} as ISpreadsheet<IAdministration>

export default spreadsheet
