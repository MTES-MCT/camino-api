import { IUtilisateur, IPermissionId } from '../types'

const permissionCheck = (
  user: IUtilisateur | undefined,
  permissions: IPermissionId[]
) => !!(user && permissions.includes(user?.permissionId))

const permissionAdministrationsCheck = (
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

export { permissionCheck, permissionAdministrationsCheck }
