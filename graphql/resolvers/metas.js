const { types, domaines, statuts } = require('../../postgres/queries/metas')

const resolvers = {
  types: async (variables, context, info) => types(),
  domaines: async (variables, context, info) => domaines(),
  statuts: async (variables, context, info) => statuts(),
  metas: async (variables, context, info) => {
    const t = await types()
    const d = await domaines()
    const s = await statuts()

    return {
      types: t,
      domaines: d,
      statuts: s
    }
  }
}

module.exports = resolvers
