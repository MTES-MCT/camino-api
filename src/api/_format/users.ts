import { IUtilisateur, IUser } from '../../types'

import { permissionCheck } from '../../tools/permission'

const userFormat = (utilisateur: IUtilisateur | undefined) => {
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
    utilisateurs: hasPermissions
  }

  return user
}

export { userFormat }
