const Permissions = require('../models/permissions')

const queries = {
  async permissionsGet({ ordreMax }) {
    return Permissions.query()
      .skipUndefined()
      .where('ordre', '>=', ordreMax)
      .orderBy('ordre')
  },

  async permissionGet(id) {
    return Permissions.query().findById(id)
  }
}

module.exports = queries
