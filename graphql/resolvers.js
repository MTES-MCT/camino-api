const {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier
} = require('./resolvers/titres')
const { substance, substances } = require('./resolvers/substances')
const json = require('./types/json')

const resolvers = {
  //  queries
  titre,
  titres,
  substance,
  substances,
  // mutations
  titreAjouter,
  titreModifier,
  titreSupprimer,
  json
}

module.exports = resolvers
