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

import {
  devises,
  documentsTypes,
  domaines,
  geoSystemes,
  permission,
  permissions,
  referencesTypes,
  statuts,
  types,
  unites,
  version
} from './resolvers/metas'
import { substance, substances } from './resolvers/substances'
import {
  entreprise,
  entreprises,
  entrepriseCreer,
  entrepriseModifier
} from './resolvers/entreprises'
import { administration, administrations } from './resolvers/administrations'
import { titreActiviteModifier } from './resolvers/titres-activites'
import { statistiques } from './resolvers/statistiques'

export default {
  //  types
  Json,
  FileUpload: GraphQLUpload,

  //  queries
  devises,
  documentsTypes,
  domaines,
  geoSystemes,
  permission,
  permissions,
  referencesTypes,
  statuts,
  types,
  unites,
  version,
  titre,
  titres,
  substance,
  substances,
  utilisateurIdentifier,
  entreprise,
  entreprises,
  administration,
  administrations,
  utilisateur,
  utilisateurs,
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
  entrepriseCreer,
  entrepriseModifier
}
