const {
  typesGet,
  domainesGet,
  statutsGet
} = require('../../postgres/queries/metas')

const resolvers = {
  async metas(variables, context, info) {
    const types = await typesGet()
    const domaines = await domainesGet()
    const statuts = await statutsGet()

    return {
      types,
      domaines,
      statuts
    }
  }
}

module.exports = resolvers
