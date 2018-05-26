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
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier,
  substance,
  substances,
  json
}

module.exports = resolvers
