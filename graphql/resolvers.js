const {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier
} = require('./resolvers/titres')
const { substance, substances } = require('./resolvers/substances')
const { geojsonMultiPolygons } = require('./resolvers/geojsons')
const json = require('./types/json')

const resolvers = {
  //  queries
  titre,
  titres,
  substance,
  substances,
  geojsonMultiPolygons,

  // mutations
  titreAjouter,
  titreModifier,
  titreSupprimer,
  json
}

module.exports = resolvers
