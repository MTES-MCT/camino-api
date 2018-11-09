const { debug } = require('../../config')

const restrictedDomaineIds = debug ? [] : ['c', 'f', 'r', 's']
const restrictedStatutIds = debug ? [] : ['dmc', 'ech', 'ind']

const permissionsCheck = (user, permissions) =>
  debug || (user && user.permission && permissions.includes(user.permission.id))

module.exports = { permissionsCheck, restrictedDomaineIds, restrictedStatutIds }
