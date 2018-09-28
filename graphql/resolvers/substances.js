const { substance, substances } = require('../../postgres/queries/substances')

const resolvers = {
  substances: async (_, context) => substances({}),
  substance: async ({ id }, context) => substance(id)
}

module.exports = resolvers
