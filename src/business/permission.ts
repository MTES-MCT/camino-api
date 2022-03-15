import { IUtilisateur, IPermissionId } from '../types'

export const permissionCheck = (
  permissionId: IPermissionId | null | undefined,
  permissions: IPermissionId[]
) => !!(permissionId && permissions.includes(permissionId))

export const permissionAdministrationsCheck = (
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
