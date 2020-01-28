import { permissionsCheck } from '../permissions/permissions-check'

const userFormat = user => {
  if (!user) return null

  user.sections = {
    activites: permissionsCheck(user, [
      'super',
      'admin',
      'editeur',
      'lecteur',
      'entreprise'
    ]),
    utilisateurs: permissionsCheck(user, ['super', 'admin'])
  }

  return user
}

export { userFormat }
