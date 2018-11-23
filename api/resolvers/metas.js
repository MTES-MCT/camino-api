const {
  restrictedDomaineIds,
  restrictedStatutIds
} = require('../../config/restrictions')

const {
  typesGet,
  domainesGet,
  statutsGet
} = require('../../database/queries/metas')

const check = (elements, restrictedList) =>
  elements.filter(element => !restrictedList.find(id => id === element.id))

const resolvers = {
  async metas(variables, context, info) {
    const types = await typesGet()
    let domaines = await domainesGet()
    let statuts = await statutsGet()

    if (!context.user) {
      domaines = check(domaines, restrictedDomaineIds)
      statuts = check(statuts, restrictedStatutIds)
    }

    return {
      types,
      domaines,
      statuts
    }
  }
}

module.exports = resolvers
