import { IUtilisateur, IUser } from '../../types'

import { permissionCheck } from '../../tools/permission'

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
    activites: hasPermissions,
    administrations: permissionCheck(user?.permissionId, ['super']),
    utilisateurs: hasPermissions,
    metas: permissionCheck(user?.permissionId, ['super'])
  }

  return user
}

export { userFormat }
