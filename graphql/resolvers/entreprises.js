const {
  entrepriseGet,
  entreprisesGet
} = require('../../postgres/queries/entreprises')

const resolvers = {
  async entreprise({ id }, context, info) {
    return entrepriseGet(id)
  },

  async entreprises({ noms }, context, info) {
    return entreprisesGet({
      noms
    })
  }
}

module.exports = resolvers
