import { IUsers } from '../../../types'

import { permissionsCheck } from '../permissions/permissions-check'

const userFormat = (user: IUsers) => {
  if (!user) return null

  const hasPermissions = permissionsCheck(user, ['super', 'admin', 'editeur', 'lecteur', 'entreprise'])

  user.sections = {
    activites: hasPermissions,
    utilisateurs: hasPermissions
  }

  return user
}

export { userFormat }
