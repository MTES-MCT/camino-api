const {
  entrepriseGet,
  entreprisesGet
} = require('../../postgres/queries/entreprises')

const resolvers = {
  entreprise: async ({ id }, context, info) => entrepriseGet(id),

  entreprises: async ({ noms }, context, info) =>
    entreprisesGet({
      noms
    })
}

module.exports = resolvers
