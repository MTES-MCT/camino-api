const { GraphQLDate } = require('graphql-iso-date')
const Json = require('./types/json')

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
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseInitialiser,
  utilisateurMotDePasseEmailEnvoyer
} = require('./resolvers/utilisateurs')
const { metas } = require('./resolvers/metas')
const { substance, substances } = require('./resolvers/substances')
const { permissions } = require('./resolvers/permissions')
const { entreprise, entreprises } = require('./resolvers/entreprises')
const { titreTravauxRapportAjouter } = require('./resolvers/titres-travaux')

module.exports = {
  //  types
  Json,
  GraphQLDate,

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
  titreTravauxRapportAjouter,

  utilisateurConnecter,
  utilisateurModifier,
  utilisateurAjouter,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseInitialiser,
  utilisateurMotDePasseEmailEnvoyer
}
