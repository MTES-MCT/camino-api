const { debug } = require('../../config/index')

const permissionsCheck = (user, permissions) =>
  debug || (user && user.permission && permissions.includes(user.permission.id))

module.exports = permissionsCheck
