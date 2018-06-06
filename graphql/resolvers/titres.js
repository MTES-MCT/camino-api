const {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier
} = require('../../postgres/queries/titres')

const {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} = require('./_tools-geojson')

const resolvers = {
  titre: async ({ id }, context, info) => {
    const t = await titre(id)

    t.phases.forEach(p => {
      p.geojsonMultiPolygon = geojsonFeatureMultiPolygon(p.points)
      p.geojsonPoints = geojsonFeatureCollectionPoints(p.points)
    })

    return t
  },

  titres: async (
    { typeIds, domaineIds, statutIds, polices, substances },
    context,
    info
  ) => {
    const ts = await titres(
      { typeIds, domaineIds, statutIds, polices, substances },
      context.user
    )
    ts.forEach(t => {
      t.phases.forEach(p => {
        p.geojsonMultiPolygon = geojsonFeatureMultiPolygon(p.points)
        p.geojsonPoints = geojsonFeatureCollectionPoints(p.points)
      })
    })

    return ts
  },

  titreAjouter: async ({ titre }, context, info) =>
    titreAjouter(titre, context.user),

  titreSupprimer: async ({ id }, context, info) =>
    titreSupprimer(id, context.user),

  titreModifier: async ({ titre }, context, info) =>
    titreModifier(titre, context.user)
}

module.exports = resolvers
