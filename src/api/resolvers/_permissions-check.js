import { debug } from '../../config/index'

const permissionsCheck = (user, permissions) =>
  debug ||
  (user && user.permissionId && permissions.includes(user.permissionId))

const permissionsAdministrationsCheck = (user, administrationsIds) =>
  debug ||
  (user &&
    user.administrations &&
    user.administrations.length &&
    administrationsIds.length &&
    user.administrations.some(ua => administrationsIds.includes(ua.id)))

export { permissionsCheck, permissionsAdministrationsCheck }
