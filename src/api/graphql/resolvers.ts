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
  utilisateurMotDePasseInitialiser,
  utilisateurEmailMessageEnvoyer,
  utilisateurEmailModifier
} from './resolvers/utilisateurs'

import {
  devises,
  deviseModifier,
  demarchesTypes,
  demarcheTypeModifier,
  demarchesStatuts,
  demarcheStatutModifier,
  travauxTypes,
  travauxTypeModifier,
  documentsTypes,
  documentsVisibilites,
  domaines,
  domaineModifier,
  etapesTypes,
  etapeTypeModifier,
  etapesStatuts,
  etapeStatutModifier,
  geoSystemes,
  permission,
  permissions,
  phasesStatuts,
  phaseStatutModifier,
  referencesTypes,
  statuts,
  titreStatutModifier,
  types,
  titreTypeTypeModifier,
  titresTypes,
  unites,
  uniteModifier,
  version,
  activitesTypes,
  activitesStatuts,
  definitions,
  definitionModifier,
  administrationsTypes,
  administrationTypeModifier,
  regions,
  departements,
  permissionModifier,
  documentTypeModifier,
  referenceTypeModifier,
  geoSystemeModifier,
  titreTypeModifier,
  titreTypeCreer,
  titreTypeSupprimer,
  titresTypesTitresStatuts,
  titreTypeTitreStatutModifier,
  titreTypeTitreStatutCreer,
  titreTypeTitreStatutSupprimer
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
import {
  administration,
  administrations,
  administrationModifier,
  administrationTitreTypeModifier,
  administrationTitreTypeTitreStatutModifier,
  administrationTitreTypeEtapeTypeModifier
} from './resolvers/administrations'
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
  phasesStatuts,
  referencesTypes,
  statuts,
  types,
  titresTypes,
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
  administrationsTypes,
  regions,
  departements,
  titresTypesTitresStatuts,

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
  utilisateurEmailMessageEnvoyer,
  utilisateurEmailModifier,
  entrepriseCreer,
  entrepriseModifier,
  administrationModifier,
  administrationTitreTypeModifier,
  administrationTitreTypeTitreStatutModifier,
  administrationTitreTypeEtapeTypeModifier,
  travauxCreer,
  travauxModifier,
  travauxSupprimer,
  travauxEtapeCreer,
  travauxEtapeModifier,
  travauxEtapeSupprimer,
  domaineModifier,
  definitionModifier,
  titreTypeTypeModifier,
  titreStatutModifier,
  demarcheTypeModifier,
  demarcheStatutModifier,
  phaseStatutModifier,
  etapeTypeModifier,
  etapeStatutModifier,
  travauxTypeModifier,
  deviseModifier,
  uniteModifier,
  administrationTypeModifier,
  permissionModifier,
  documentTypeModifier,
  referenceTypeModifier,
  geoSystemeModifier,
  titreTypeModifier,
  titreTypeCreer,
  titreTypeSupprimer,
  titreTypeTitreStatutModifier,
  titreTypeTitreStatutCreer,
  titreTypeTitreStatutSupprimer
}
