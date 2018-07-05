const { statuts } = require('../../postgres/queries/metas')

const resolvers = {
  statuts: async ({}, context, info) => statuts()
}

module.exports = resolvers
