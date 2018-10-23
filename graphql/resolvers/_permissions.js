const { debug } = require('../../config')

const restrictedDomaineIds = debug ? [] : ['c', 'f', 'r', 's', 'm']
const restrictedStatutIds = debug ? [] : ['dmc', 'ech', 'ind']

const permissionsCheck = (user, permissions) =>
  debug || (user && permissions.includes(user.permission.id))

module.exports = { permissionsCheck, restrictedDomaineIds, restrictedStatutIds }
