const {
  titreGet,
  titresGet,
  titreAdd,
  titreRemove,
  titreUpdate
} = require('../../postgres/queries/titres')

const { titreFormat } = require('./_utils')

const restricted = {
  domaineIds: ['g', 'h', 'w'],
  statutIds: ['dmi', 'mod', 'val']
}

const resolvers = {
  async titre({ id }, context, info) {
    let titre = await titreGet(id)

    if (!context.user) {
      if (
        restricted.domaineIds.includes(titre.domaineId) ||
        restricted.statutIds.includes(titre.statutId)
      ) {
        titre = null
      }
    }

    return titre && titreFormat(titre)
  },

  async titres(
    { typeIds, domaineIds, statutIds, substances, noms },
    context,
    info
  ) {
    if (!context.user) {
      if (domaineIds) {
        domaineIds = domaineIds.filter(id => restricted.domaineIds.includes(id))
      } else {
        domaineIds = restricted.domaineIds
      }

      if (statutIds) {
        statutIds = statutIds.filter(id => restricted.statutIds.includes(id))
      } else {
        statutIds = restricted.statutIds
      }
    }

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
