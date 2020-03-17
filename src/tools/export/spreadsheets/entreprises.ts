import { IEntreprise } from '../../../types'
import { ISpreadsheet } from '../types'
import { entreprisesGet } from '../../../database/queries/entreprises'

const id = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_ENTREPRISES

const get = () => entreprisesGet({})

const tables = [
  {
    id: 1,
    name: 'entreprises',
    columns: [
      'id',
      'nom',
      'paysId',
      'legalSiren',
      'legalEtranger',
      'legalForme',
      'categorie',
      'dateCreation',
      'adresse',
      'codePostal',
      'commune',
      'cedex',
      'url',
      'email',
      'telephone'
    ]
  },
  {
    id: 2,
    name: 'entreprises_etablissements',
    columns: [
      'id',
      { id: 'entrepriseId', parentKey: 'parent.id' },
      'nom',
      'legalSiret',
      'dateDebut',
      'dateFin'
    ],
    parents: ['etablissements']
  }
]

const spreadsheet = {
  id,
  name: 'entreprises',
  get,
  tables
} as ISpreadsheet<IEntreprise>

export default spreadsheet
