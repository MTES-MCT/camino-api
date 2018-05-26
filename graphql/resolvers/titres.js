const {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier
} = require('../../postgres/queries/titres')

const resolvers = {
  async titre({ id }) {
    return titre(id)
  },

  async titres({ typeId, domaineId, statutId, travauxId }, context, info) {
    // console.log('this -------->', this)
    // console.log('context ----->', context)
    // console.log('info -------->', info)
    return titres({ typeId, domaineId, statutId, travauxId }, context)
  },

  async titreAjouter({ titre }, context) {
    return titreAjouter(titre, context)
  },

  async titreSupprimer({ id }, context) {
    return titreSupprimer(id, context)
  },

  async titreModifier({ titre }, context) {
    return titreModifier(titre, context)
  }
}

module.exports = resolvers
