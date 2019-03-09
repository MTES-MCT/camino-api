import { utilisateursGet } from '../../../database/queries/utilisateurs'

const id = process.env.GOOGLE_SPREADSHEET_ID_EXPORT_UTILISATEURS

const get = utilisateursGet({
  noms: undefined,
  entrepriseIds: undefined,
  administrationIds: undefined,
  permissionIds: undefined
})

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
      'administrationId',
      'entrepriseId',
      'telephoneFixe',
      'telephoneMobile',
      'permissionId',
      'preferences'
    ],
    callbacks: {
      preferences: v => JSON.stringify(v)
    }
  }
]

const spreadsheet = {
  id,
  name: 'utilisateurs',
  get,
  tables
}

export default spreadsheet
