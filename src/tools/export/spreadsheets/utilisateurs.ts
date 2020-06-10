import { ISpreadsheet } from '../types'
import { utilisateursGet } from '../../../database/queries/utilisateurs'
import { IUtilisateur, Index } from '../../../types'

const id = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_UTILISATEURS

const get = () =>
  utilisateursGet(
    {
      nomsPrenoms: undefined,
      entrepriseIds: undefined,
      administrationIds: undefined,
      permissionIds: undefined
    },
    {},
    'super'
  )

const tables = [
  {
    id: 1,
    name: 'utilisateurs',
    columns: [
      'id',
      'email',
      'motDePasse',
      'nom',
      'prenom',
      'telephoneFixe',
      'telephoneMobile',
      'permissionId',
      'preferences'
    ],
    callbacks: {
      preferences: (v: Index<unknown>) => JSON.stringify(v)
    }
  },
  {
    id: 2,
    name: 'utilisateurs__entreprises',
    columns: [
      { id: 'utilisateurId', parentKey: 'id' },
      { id: 'entrepriseId', key: 'id' }
    ],
    parents: ['entreprises']
  },
  {
    id: 3,
    name: 'utilisateurs__administrations',
    columns: [
      { id: 'utilisateurId', parentKey: 'id' },
      { id: 'administrationId', key: 'id' }
    ],
    parents: ['administrations']
  }
]

const spreadsheet = {
  id,
  name: 'utilisateurs',
  get,
  tables
} as ISpreadsheet<IUtilisateur>

export default spreadsheet
