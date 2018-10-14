const {
  permissionGet,
  permissionsGet
} = require('../../postgres/queries/permissions')

const resolvers = {
  async permissions(_, context) {
    return permissionsGet({})
  },
  async permission({ id }, context) {
    return permissionGet(id)
  }
}

module.exports = resolvers
