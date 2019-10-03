import * as dateFormat from 'dateformat'

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
      'adresse',
      'codePostal',
      'cedex',
      'commune',
      'insee',
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
      'dateDebut',
      'dateFin',
      'legalSiret'
    ],
    parents: ['etablissements'],
    callbacks: {
      dateDebut: v => dateFormat(v, 'yyyy-mm-dd'),
      dateFin: v => dateFormat(v, 'yyyy-mm-dd')
    }
  }
]

const spreadsheet = {
  id,
  name: 'entreprises',
  get,
  tables
}

export default spreadsheet
