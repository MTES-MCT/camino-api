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
  utilisateurMotDePasseEmailEnvoyer,
  utilisateurAjoutEmailEnvoyer
} = require('./resolvers/utilisateurs')
const { version } = require('./resolvers/version')
const { metas } = require('./resolvers/metas')
const { substance, substances } = require('./resolvers/substances')
const { permissions } = require('./resolvers/permissions')
const { entreprise, entreprises } = require('./resolvers/entreprises')
const { titreTravauxRapportModifier } = require('./resolvers/titres-travaux')

module.exports = {
  //  types
  Json,
  GraphQLDate,

  //  queries
  version,
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
  titreTravauxRapportModifier,

  utilisateurConnecter,
  utilisateurModifier,
  utilisateurAjouter,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseInitialiser,
  utilisateurMotDePasseEmailEnvoyer,
  utilisateurAjoutEmailEnvoyer
}
