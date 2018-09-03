const {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier
} = require('../../postgres/queries/titres')

const { types, domaines, statuts } = require('../../postgres/queries/metas')

const {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} = require('./_tools-geojson')

const titreFormat = t => {
  t.references =
    t.references &&
    Object.keys(t.references).map(r => ({
      type: r,
      valeur: t.references[r]
    }))
  t.demarches &&
    t.demarches.forEach(d => {
      d.etapes &&
        d.etapes.forEach(e => {
          if (e.points.length > 0) {
            e.geojsonMultiPolygon = geojsonFeatureMultiPolygon(e.points)
            e.geojsonPoints = geojsonFeatureCollectionPoints(e.points)
          }
        })
    })

  t.demarches = t.demarches.reverse()

  return t
}

const resolvers = {
  titre: async ({ id }, context, info) => {
    const t = await titre(id)
    return titreFormat(t)
  },

  titres: async (
    { typeIds, domaineIds, statutIds, substances, noms },
    context,
    info
  ) => {
    const ts = await titres(
      { typeIds, domaineIds, statutIds, substances, noms },
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
