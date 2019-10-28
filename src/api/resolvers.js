import Json from './types/json'
import { GraphQLUpload } from 'graphql-upload'

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
  titreDocumentCreer,
  titreDocumentModifier,
  titreDocumentSupprimer
} from './resolvers/titres-documents'

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
import {
  entrepriseCreer,
  entrepriseParSirenDatabase,
  entrepriseParSirenApi
} from './resolvers/entreprise'
import { administration, administrations } from './resolvers/administrations'
import { titreActiviteModifier } from './resolvers/titres-activites'
import { statistiques } from './resolvers/statistiques'

export default {
  //  types
  Json,
  FileUpload: GraphQLUpload,

  //  queries
  version,
  titre,
  titres,
  substance,
  substances,
  metas,
  utilisateurIdentifier,
  entreprise,
  entrepriseParSirenDatabase,
  entrepriseParSirenApi,
  entreprises,
  administration,
  administrations,
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
  titreDocumentCreer,
  titreDocumentModifier,
  titreDocumentSupprimer,
  titreActiviteModifier,
  utilisateurConnecter,
  utilisateurModifier,
  utilisateurCreer,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseInitialiser,
  utilisateurMotDePasseEmailEnvoyer,
  utilisateurCreationEmailEnvoyer,
  entrepriseCreer
}
