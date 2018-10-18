const {
  entrepriseGet,
  entreprisesGet
} = require('../../postgres/queries/entreprises')
const { permissionsCheck } = require('./_permissions')

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
