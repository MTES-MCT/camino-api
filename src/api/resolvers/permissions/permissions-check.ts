import { IUtilisateur } from '../../../types'

const permissionsCheck = (
  user: IUtilisateur | undefined,
  permissions: string[]
) => !!(user && user.permissionId && permissions.includes(user.permissionId))

const permissionsAdministrationsCheck = (
  user: IUtilisateur | undefined,
  administrationsIds: string[]
) =>
  !!(
    user &&
    user.administrations &&
    user.administrations.length &&
    administrationsIds.length &&
    user.administrations.some(ua => administrationsIds.includes(ua.id))
  )

export { permissionsCheck, permissionsAdministrationsCheck }
