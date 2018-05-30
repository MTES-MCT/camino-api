const { geojson } = require('../../postgres/queries/geojson')

const resolvers = {
  geojson: async ({ id }, context, info) => geojson(id)

  // titres: async ({ typeId, domaineId, statutId, police }, context, info) =>
  //   titres({ typeId, domaineId, statutId, police }, context.user),

  // titreAjouter: async ({ titre }, context, info) =>
  //   titreAjouter(titre, context.user),

  // titreSupprimer: async ({ id }, context, info) =>
  //   titreSupprimer(id, context.user),

  // titreModifier: async ({ titre }, context, info) =>
  //   titreModifier(titre, context.user)
}

module.exports = resolvers
