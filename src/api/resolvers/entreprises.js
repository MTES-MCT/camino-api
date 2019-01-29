const {
  entrepriseGet,
  entreprisesGet
} = require('../../database/queries/entreprises')
const permissionsCheck = require('./_permissions-check')

const resolvers = {
  async entreprise({ id }, context, info) {
    if (context.user && permissionsCheck(context.user, ['super', 'admin'])) {
      return entrepriseGet(id)
    }

    return null
  },

  async entreprises({ noms }, context, info) {
    if (context.user && permissionsCheck(context.user, ['super', 'admin'])) {
      return entreprisesGet({ noms })
    }

    return null
  }
}

module.exports = resolvers
