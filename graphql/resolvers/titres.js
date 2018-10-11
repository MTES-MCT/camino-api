const {
  titreGet,
  titresGet,
  titreAdd,
  titreRemove,
  titreUpdate
} = require('../../postgres/queries/titres')

const { titreFormat } = require('./_utils')

const resolvers = {
  async titre({ id }, context, info) {
    const titre = await titreGet(id)
    return titre && titreFormat(titre)
  },

  async titres(
    { typeIds, domaineIds, statutIds, substances, noms },
    context,
    info
  ) {
    const titres = await titresGet({
      typeIds,
      domaineIds,
      statutIds,
      substances,
      noms
    })

    return titres.map(titre => titre && titreFormat(titre))
  },

  async titreAjouter({ titre }, context, info) {
    return titreAdd(titre)
  },

  async titreSupprimer({ id }, context, info) {
    return titreRemove(id)
  },

  async titreModifier({ titre }, context, info) {
    return titreUpdate(titre)
  }
}

module.exports = resolvers
