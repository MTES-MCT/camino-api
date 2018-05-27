const {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier
} = require('../../postgres/queries/titres')

const resolvers = {
  titre: async ({ id }, context, info) => titre(id),

  titres: async ({ typeId, domaineId, statutId, police }, context, info) => {
    console.log('context: ', context)
    return titres({ typeId, domaineId, statutId, police }, context.user)
  },

  titreAjouter: async ({ titre }, context, info) => {
    console.log('context: ', context)
    return titreAjouter(titre, context.user)
  },

  titreSupprimer: async ({ id }, context, info) =>
    titreSupprimer(id, context.user),

  titreModifier: async ({ titre }, context, info) =>
    titreModifier(titre, context.user)
}

module.exports = resolvers
