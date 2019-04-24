import { GraphQLDate } from 'graphql-iso-date'

import Json from './types/json'

import {
  titre,
  titres,
  titreAjouter,
  titreSupprimer,
  titreModifier
} from './resolvers/titres'

import {
  titreEtapeModifier,
  titreEtapeSupprimer
} from './resolvers/titres-etapes'

import {
  titreDemarcheModifier,
  titreDemarcheSupprimer
} from './resolvers/titres-demarches'

import {
  utilisateur,
  utilisateurs,
  utilisateurIdentifier,
  utilisateurConnecter,
  utilisateurAjouter,
  utilisateurAjoutEmailEnvoyer,
  utilisateurModifier,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseEmailEnvoyer,
  utilisateurMotDePasseInitialiser
} from './resolvers/utilisateurs'

import { version } from './resolvers/version'
import { metas } from './resolvers/metas'
import { substance, substances } from './resolvers/substances'
import { permissions } from './resolvers/permissions'
import { entreprise, entreprises } from './resolvers/entreprises'
import { titreActiviteModifier } from './resolvers/titres-activites'

export default {
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
  titreDemarcheModifier,
  titreDemarcheSupprimer,
  titreEtapeModifier,
  titreEtapeSupprimer,
  titreActiviteModifier,
  utilisateurConnecter,
  utilisateurModifier,
  utilisateurAjouter,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseInitialiser,
  utilisateurMotDePasseEmailEnvoyer,
  utilisateurAjoutEmailEnvoyer
}
