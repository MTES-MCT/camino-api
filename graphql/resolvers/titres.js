const {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier
} = require('../../postgres/queries/titres')

const titreFormat = t => {
  t.perimetres = []
  t.demarches &&
    t.demarches.forEach(d => {
      d.etapes &&
        d.etapes.forEach(e => {
          if (e.points) {
            const geojsonMultiPolygon = geojsonFeatureMultiPolygon(e.points)
            const geojsonPoints = geojsonFeatureCollectionPoints(e.points)
            e.geojsonMultiPolygon = geojsonMultiPolygon
            e.geojsonPoints = geojsonPoints
            // if (e.etapeId === 'dpu' && e.etapeStatutId === 'ter') {
            //   t.perimetres.push({
            //     date: e.date,
            //     geojsonMultiPolygon: geojsonMultiPolygon,
            //     geojsonPoints: geojsonPoints
            //   })
            // }
          }
        })
    })

  return t
}

const {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} = require('./_tools-geojson')

const resolvers = {
  titre: async ({ id }, context, info) => {
    const t = await titre(id)
    return titreFormat(t)
  },

  titres: async (
    { typeIds, domaineIds, statutIds, substances },
    context,
    info
  ) => {
    const ts = await titres(
      { typeIds, domaineIds, statutIds, substances },
      context.user
    )

    return ts.map(t => titreFormat(t))
  },

  titreAjouter: async ({ titre }, context, info) =>
    titreAjouter(titre, context.user),

  titreSupprimer: async ({ id }, context, info) =>
    titreSupprimer(id, context.user),

  titreModifier: async ({ titre }, context, info) =>
    titreModifier(titre, context.user)
}

module.exports = resolvers
