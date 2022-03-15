import { IUtilisateur, IUser } from '../../types'

import { permissionCheck } from '../../business/permission'

const userFormat = (utilisateur: IUtilisateur | null) => {
  if (!utilisateur) return null

  const user = utilisateur as IUser

  const hasPermissions = permissionCheck(user?.permissionId, [
    'super',
    'admin',
    'editeur',
    'lecteur',
    'entreprise'
  ])

  user.sections = {
    travaux: permissionCheck(user?.permissionId, [
      'admin',
      'editeur',
      'lecteur',
      'super'
    ]),
    activites: hasPermissions,
    administrations: permissionCheck(user?.permissionId, [
      'super',
      'admin',
      'editeur',
      'lecteur'
    ]),
    utilisateurs: hasPermissions,
    metas: permissionCheck(user?.permissionId, ['super']),
    journaux: permissionCheck(user?.permissionId, ['super'])
  }

  return user
}

export { userFormat }
