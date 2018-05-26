const { substance, substances } = require('../../postgres/queries/substances')

const resolvers = {
  substances: async (_, context) => substances({}, context.user),
  substance: async ({ id }, context) => substance(id, context.user)
}

module.exports = resolvers
