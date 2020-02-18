import { IUtilisateur, IUser } from '../../../types'

import { permissionsCheck } from '../permissions/permissions-check'

const userFormat = (utilisateur: IUtilisateur | undefined) => {
  if (!utilisateur) return null

  const user = utilisateur as IUser

  const hasPermissions = permissionsCheck(user, [
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
