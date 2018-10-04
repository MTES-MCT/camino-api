const {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier
} = require('./resolvers/titres')

const {
  utilisateurConnecter,
  utilisateurIdentifier
} = require('./resolvers/utilisateurs')
const { metas } = require('./resolvers/metas')
const { substance, substances } = require('./resolvers/substances')
const { entreprise, entreprises } = require('./resolvers/entreprises')
const json = require('./types/json')

module.exports = {
  //  queries
  titre,
  titres,
  substance,
  substances,
  metas,
  utilisateurIdentifier,
  entreprise,
  entreprises,

  // mutations
  titreAjouter,
  titreModifier,
  titreSupprimer,
  json,

  utilisateurConnecter
}
