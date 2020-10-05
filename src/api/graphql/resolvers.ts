import GraphQLJSON from 'graphql-type-json'
import { GraphQLUpload } from 'graphql-upload'

import {
  titre,
  titres,
  titreCreer,
  titreSupprimer,
  titreModifier
} from './resolvers/titres'

import {
  etapeCreer,
  etapeModifier,
  etapeSupprimer,
  etapeJustificatifsAssocier,
  etapeJustificatifDissocier
} from './resolvers/titres-etapes'

import {
  documents,
  documentCreer,
  documentModifier,
  documentSupprimer
} from './resolvers/documents'

import {
  demarches,
  demarcheCreer,
  demarcheModifier,
  demarcheSupprimer
} from './resolvers/titres-demarches'

import {
  utilisateur,
  utilisateurs,
  moi,
  utilisateurTokenCreer,
  utilisateurTokenRafraichir,
  utilisateurCerbereTokenCreer,
  utilisateurCerbereUrlObtenir,
  utilisateurCreer,
  utilisateurCreationMessageEnvoyer,
  utilisateurModifier,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseMessageEnvoyer,
  utilisateurMotDePasseInitialiser
} from './resolvers/utilisateurs'

import {
  devises,
  demarchesTypes,
  demarchesStatuts,
  travauxTypes,
  documentsTypes,
  documentsVisibilites,
  domaines,
  etapesTypes,
  etapesStatuts,
  geoSystemes,
  permission,
  permissions,
  referencesTypes,
  statuts,
  types,
  unites,
  version,
  activitesTypes,
  activitesStatuts,
  definitions
} from './resolvers/metas'

import {
  substance,
  substances,
  substancesLegales
} from './resolvers/substances'
import {
  entreprise,
  entreprises,
  entrepriseCreer,
  entrepriseModifier
} from './resolvers/entreprises'
import { administration, administrations } from './resolvers/administrations'
import {
  activite,
  activites,
  activitesAnnees,
  activiteModifier
} from './resolvers/titres-activites'
import {
  statistiquesGlobales,
  statistiquesGuyane
} from './resolvers/statistiques'

import {
  travauxCreer,
  travauxModifier,
  travauxSupprimer
} from './resolvers/titres-travaux'

import {
  travauxEtapeCreer,
  travauxEtapeModifier,
  travauxEtapeSupprimer
} from './resolvers/titres-travaux-etapes'

export default {
  //  types
  Json: GraphQLJSON,
  FileUpload: GraphQLUpload,

  //  queries
  demarches,
  demarchesTypes,
  demarchesStatuts,
  travauxTypes,
  devises,
  documents,
  documentsTypes,
  documentsVisibilites,
  domaines,
  etapesTypes,
  etapesStatuts,
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
  substancesLegales,
  moi,
  entreprise,
  entreprises,
  administration,
  administrations,
  utilisateur,
  utilisateurs,
  statistiquesGlobales,
  statistiquesGuyane,
  activite,
  activites,
  activitesAnnees,
  activitesTypes,
  activitesStatuts,
  definitions,

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
  etapeJustificatifsAssocier,
  etapeJustificatifDissocier,
  documentCreer,
  documentModifier,
  documentSupprimer,
  activiteModifier,
  utilisateurTokenCreer,
  utilisateurTokenRafraichir,
  utilisateurCerbereTokenCreer,
  utilisateurCerbereUrlObtenir,
  utilisateurModifier,
  utilisateurCreer,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseInitialiser,
  utilisateurMotDePasseMessageEnvoyer,
  utilisateurCreationMessageEnvoyer,
  entrepriseCreer,
  entrepriseModifier,
  travauxCreer,
  travauxModifier,
  travauxSupprimer,
  travauxEtapeCreer,
  travauxEtapeModifier,
  travauxEtapeSupprimer
}
