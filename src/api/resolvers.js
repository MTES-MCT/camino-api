import { GraphQLDate } from 'graphql-iso-date'

import Json from './types/json'

import {
  titre,
  titres,
  titreCreer,
  titreSupprimer,
  titreModifier
} from './resolvers/titres'

import {
  titreEtapeCreer,
  titreEtapeModifier,
  titreEtapeSupprimer
} from './resolvers/titres-etapes'

import {
  titreDemarcheCreer,
  titreDemarcheModifier,
  titreDemarcheSupprimer
} from './resolvers/titres-demarches'

import {
  utilisateur,
  utilisateurs,
  utilisateurIdentifier,
  utilisateurConnecter,
  utilisateurCreer,
  utilisateurCreationEmailEnvoyer,
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
import { statistiques } from './resolvers/statistiques'

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
  statistiques,

  // mutations
  titreCreer,
  titreModifier,
  titreSupprimer,
  titreDemarcheCreer,
  titreDemarcheModifier,
  titreDemarcheSupprimer,
  titreEtapeCreer,
  titreEtapeModifier,
  titreEtapeSupprimer,
  titreActiviteModifier,
  utilisateurConnecter,
  utilisateurModifier,
  utilisateurCreer,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseInitialiser,
  utilisateurMotDePasseEmailEnvoyer,
  utilisateurCreationEmailEnvoyer
}
