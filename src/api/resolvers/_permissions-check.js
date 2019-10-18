import { debug } from '../../config/index'

const permissionsCheck = (user, permissions) =>
  debug || (user && user.permission && permissions.includes(user.permission.id))

const permissionsAdministrationsCheck = (user, administrationsIds) =>
  debug ||
  (user &&
    user.administrations &&
    user.administrations.length &&
    administrationsIds.length &&
    user.administrations.some(ua => administrationsIds.includes(ua.id)))

export { permissionsCheck, permissionsAdministrationsCheck }
