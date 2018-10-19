const {
  typesGet,
  domainesGet,
  statutsGet
} = require('../../postgres/queries/metas')

const restricted = {
  domaineIds: ['g', 'h', 'w', 'm'],
  statutIds: ['dmi', 'mod', 'val']
}

const check = (elements, restrictedList) =>
  elements.filter(element => restrictedList.find(r => r === element.id))

const resolvers = {
  async metas(variables, context, info) {
    const types = await typesGet()
    let domaines = await domainesGet()
    let statuts = await statutsGet()

    if (!context.user) {
      domaines = check(domaines, restricted.domaineIds)
      statuts = check(statuts, restricted.statutIds)
    }

    return {
      types,
      domaines,
      statuts
    }
  }
}

module.exports = resolvers
