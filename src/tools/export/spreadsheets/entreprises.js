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
      'categorie',
      'dateCreation',
      'adresse',
      'codePostal',
      'commune',
      'cedex',
      'url',
      'email',
      'telephone'
    ],
    callbacks: {
      dateCreation: v => dateFormat(v, 'yyyy-mm-dd')
    }
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
