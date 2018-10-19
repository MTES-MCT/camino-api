const {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier,
  titreEtapeModifier
} = require('./resolvers/titres')

const {
  utilisateur,
  utilisateurs,
  utilisateurConnecter,
  utilisateurIdentifier,
  utilisateurModifier,
  utilisateurAjouter,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier
} = require('./resolvers/utilisateurs')
const { metas } = require('./resolvers/metas')
const { substance, substances } = require('./resolvers/substances')
const { permissions } = require('./resolvers/permissions')
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
  utilisateur,
  utilisateurs,
  permissions,

  // mutations
  titreAjouter,
  titreModifier,
  titreSupprimer,
  titreEtapeModifier,
  json,

  utilisateurConnecter,
  utilisateurModifier,
  utilisateurAjouter,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier
}
