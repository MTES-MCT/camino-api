import { debug } from '../../config/index'

const hasDuplicates = array => new Set(array).size !== array.length

const permissionsCheck = (user, permissions) =>
  debug || (user && user.permission && permissions.includes(user.permission.id))

const permissionsAdministrationsCheck = (user, administrations) =>
  debug ||
  (user &&
    user.administrations &&
    user.administrations.length &&
    administrations.length &&
    hasDuplicates([...user.administrations.map(a => a.id), ...administrations]))

export { permissionsCheck, permissionsAdministrationsCheck }
