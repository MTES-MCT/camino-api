const { types, domaines, statuts } = require('../../postgres/queries/metas')

const resolvers = {
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
