const {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier
} = require('./resolvers/titres')
const { statuts } = require('./resolvers/metas')
const { substance, substances } = require('./resolvers/substances')
const json = require('./types/json')

const resolvers = {
  //  queries
  titre,
  titres,
  substance,
  substances,
  statuts,

  // mutations
  titreAjouter,
  titreModifier,
  titreSupprimer,
  json
}

module.exports = resolvers
