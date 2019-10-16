import { debug } from '../../config/index'

const permissionsCheck = (user, permissions) =>
  debug || (user && user.permission && permissions.includes(user.permission.id))

export default permissionsCheck
