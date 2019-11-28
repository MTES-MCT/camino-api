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
  demarcheEtapesTypes,
  etapeCreer,
  etapeModifier,
  etapeSupprimer
} from './resolvers/titres-etapes'

import {
  documentCreer,
  documentModifier,
  documentSupprimer
} from './resolvers/titres-documents'

import {
  titreDemarchesTypes,
  demarcheCreer,
  demarcheModifier,
  demarcheSupprimer
} from './resolvers/titres-demarches'

import {
  utilisateur,
  utilisateurs,
  moi,
  utilisateurTokenCreer,
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
  version,
  utilisateurDomaines
} from './resolvers/metas'
import { substance, substances } from './resolvers/substances'
import {
  entreprise,
  entreprises,
  entrepriseCreer,
  entrepriseModifier
} from './resolvers/entreprises'
import { administration, administrations } from './resolvers/administrations'
import { activiteModifier } from './resolvers/titres-activites'
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
  moi,
  entreprise,
  entreprises,
  administration,
  administrations,
  utilisateur,
  utilisateurs,
  statistiques,
  titreDemarchesTypes,
  demarcheEtapesTypes,
  utilisateurDomaines,

  // mutations
  titreCreer,
  titreModifier,
  titreSupprimer,
  demarcheCreer,
  demarcheModifier,
  demarcheSupprimer,
  etapeCreer,
  etapeModifier,
  etapeSupprimer,
  documentCreer,
  documentModifier,
  documentSupprimer,
  activiteModifier,
  utilisateurTokenCreer,
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
