const permissionsCheck = require('./_permissions-check')

const { restrictedDomaineIds, restrictedStatutIds } = require('./_restrictions')

const {
  typesGet,
  domainesGet,
  statutsGet,
  demarchesTypesGet
} = require('../../database/queries/metas')

const check = (elements, restrictedList) =>
  elements.filter(element => !restrictedList.find(id => id === element.id))

const resolvers = {
  async metas(variables, context, info) {
    const types = await typesGet()
    let domaines = await domainesGet()
    let statuts = await statutsGet()
    let demarchesTypes

    if (!context.user) {
      domaines = check(domaines, restrictedDomaineIds)
      statuts = check(statuts, restrictedStatutIds)
    }

    if (permissionsCheck(context.user, ['super', 'admin'])) {
      demarchesTypes = demarchesTypesGet()
    }

    return {
      types,
      domaines,
      statuts,
      demarchesTypes
    }
  }
}

module.exports = resolvers
