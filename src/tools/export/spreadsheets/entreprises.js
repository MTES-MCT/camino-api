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
      { key: 'parent.id', value: 'entrepriseId' },
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
}

export default spreadsheet
