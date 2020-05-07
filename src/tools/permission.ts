import { IUtilisateur, IPermissionId } from '../types'

const permissionCheck = (
  permissionId: IPermissionId | null | undefined,
  permissions: IPermissionId[]
) => !!(permissionId && permissions.includes(permissionId))

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
