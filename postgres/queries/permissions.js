const Permissions = require('../models/permissions')

const queries = {
  async permissionsGet() {
    return Permissions.query().orderBy('ordre')
  },

  async permissionGet(id) {
    return Permissions.query().findById(id)
  }
}

module.exports = queries
