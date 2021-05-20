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
  etape,
  etapeHeritage,
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
  unites,
  uniteModifier,
  version,
  definitions,
  definitionModifier,
  administrationsTypes,
  administrationTypeModifier,
  regions,
  departements,
  permissionModifier,
  documentTypeModifier,
  referenceTypeModifier,
  geoSystemeModifier
} from './resolvers/metas'

import {
  activitesTypes,
  activiteTypeModifier,
  activitesStatuts,
  activiteStatutModifier,
  activitesTypesTitresTypes,
  activiteTypeTitreTypeCreer,
  activiteTypeTitreTypeSupprimer,
  activitesTypesDocumentsTypes,
  activiteTypeDocumentTypeModifier,
  activiteTypeDocumentTypeCreer,
  activiteTypeDocumentTypeSupprimer,
  activitesTypesPays,
  activiteTypePaysCreer,
  activiteTypePaysSupprimer
} from './resolvers/metas-activites'

import {
  titresTypes,
  titreTypeModifier,
  titreTypeCreer,
  titreTypeSupprimer,
  titresTypesTitresStatuts,
  titreTypeTitreStatutModifier,
  titreTypeTitreStatutCreer,
  titreTypeTitreStatutSupprimer,
  titresTypesDemarchesTypes,
  titreTypeDemarcheTypeModifier,
  titreTypeDemarcheTypeCreer,
  titreTypeDemarcheTypeSupprimer,
  titresTypesDemarchesTypesEtapesTypes,
  titreTypeDemarcheTypeEtapeTypeModifier,
  titreTypeDemarcheTypeEtapeTypeCreer,
  titreTypeDemarcheTypeEtapeTypeSupprimer,
  etapesTypesEtapesStatuts,
  etapeTypeEtapeStatutModifier,
  etapeTypeEtapeStatutCreer,
  etapeTypeEtapeStatutSupprimer,
  etapesTypesDocumentsTypes,
  etapeTypeDocumentTypeModifier,
  etapeTypeDocumentTypeCreer,
  etapeTypeDocumentTypeSupprimer,
  etapesTypesJustificatifsTypes,
  etapeTypeJustificatifTypeModifier,
  etapeTypeJustificatifTypeCreer,
  etapeTypeJustificatifTypeSupprimer
} from './resolvers/metas-join'

import {
  travauxTypes,
  travauxTypeModifier,
  travauxEtapesTypes,
  travauxEtapeTypeModifier
} from './resolvers/metas-travaux'

import {
  travauxTypesTravauxEtapesTypes,
  travauxTypeTravauxEtapeTypeModifier,
  travauxTypeTravauxEtapeTypeCreer,
  travauxTypeTravauxEtapeTypeSupprimer,
  travauxEtapesTypesDocumentsTypes,
  travauxEtapeTypeDocumentTypeModifier,
  travauxEtapeTypeDocumentTypeCreer,
  travauxEtapeTypeDocumentTypeSupprimer,
  travauxEtapesTypesEtapesStatuts,
  travauxEtapeTypeEtapeStatutModifier,
  travauxEtapeTypeEtapeStatutCreer,
  travauxEtapeTypeEtapeStatutSupprimer
} from './resolvers/metas-travaux-join'

import {
  substance,
  substances,
  substancesLegales
} from './resolvers/substances'

import {
  entreprise,
  entreprises,
  entrepriseCreer,
  entrepriseModifier,
  entrepriseTitreTypeModifier,
  entreprisesTitresCreation
} from './resolvers/entreprises'
import {
  administration,
  administrations,
  administrationModifier,
  administrationTitreTypeModifier,
  administrationTitreTypeTitreStatutModifier,
  administrationTitreTypeEtapeTypeModifier,
  administrationActiviteTypeModifier
} from './resolvers/administrations'
import {
  activite,
  activites,
  activitesAnnees,
  activiteModifier,
  activiteSupprimer
} from './resolvers/titres-activites'
import { statistiquesGlobales } from './resolvers/statistiques'
import { statistiquesGuyane } from './resolvers/statistiques-guyane'
import { statistiquesGranulatsMarins } from './resolvers/statistiques-granulats-marins'

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

import { titreDemandeCreer } from './resolvers/titre-demande'

export default {
  //  types
  Json: GraphQLJSON,
  FileUpload: GraphQLUpload,

  //  queries
  etape,
  etapeHeritage,
  demarches,
  demarchesTypes,
  demarchesStatuts,
  travauxTypes,
  travauxEtapesTypes,
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
  statistiquesGranulatsMarins,
  activite,
  activites,
  activitesAnnees,
  definitions,
  administrationsTypes,
  regions,
  departements,
  titresTypesTitresStatuts,
  titresTypesDemarchesTypes,
  titresTypesDemarchesTypesEtapesTypes,
  etapesTypesEtapesStatuts,
  etapesTypesDocumentsTypes,
  etapesTypesJustificatifsTypes,
  travauxTypesTravauxEtapesTypes,
  travauxEtapesTypesDocumentsTypes,
  travauxEtapesTypesEtapesStatuts,
  activitesTypes,
  activitesStatuts,
  activitesTypesTitresTypes,
  activitesTypesDocumentsTypes,
  activitesTypesPays,

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
  activiteSupprimer,
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
  entrepriseTitreTypeModifier,
  entreprisesTitresCreation,
  administrationModifier,
  administrationTitreTypeModifier,
  administrationTitreTypeTitreStatutModifier,
  administrationTitreTypeEtapeTypeModifier,
  administrationActiviteTypeModifier,
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
  travauxEtapeTypeModifier,
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
  titreTypeTitreStatutSupprimer,

  titreTypeDemarcheTypeModifier,
  titreTypeDemarcheTypeCreer,
  titreTypeDemarcheTypeSupprimer,

  titreTypeDemarcheTypeEtapeTypeModifier,
  titreTypeDemarcheTypeEtapeTypeCreer,
  titreTypeDemarcheTypeEtapeTypeSupprimer,

  etapeTypeEtapeStatutModifier,
  etapeTypeEtapeStatutCreer,
  etapeTypeEtapeStatutSupprimer,

  etapeTypeDocumentTypeModifier,
  etapeTypeDocumentTypeCreer,
  etapeTypeDocumentTypeSupprimer,

  etapeTypeJustificatifTypeModifier,
  etapeTypeJustificatifTypeCreer,
  etapeTypeJustificatifTypeSupprimer,

  travauxTypeTravauxEtapeTypeModifier,
  travauxTypeTravauxEtapeTypeCreer,
  travauxTypeTravauxEtapeTypeSupprimer,

  travauxEtapeTypeDocumentTypeModifier,
  travauxEtapeTypeDocumentTypeCreer,
  travauxEtapeTypeDocumentTypeSupprimer,

  travauxEtapeTypeEtapeStatutModifier,
  travauxEtapeTypeEtapeStatutCreer,
  travauxEtapeTypeEtapeStatutSupprimer,

  activiteTypeModifier,
  activiteStatutModifier,
  activiteTypeTitreTypeCreer,
  activiteTypeTitreTypeSupprimer,
  activiteTypeDocumentTypeCreer,
  activiteTypeDocumentTypeModifier,
  activiteTypeDocumentTypeSupprimer,
  activiteTypePaysCreer,
  activiteTypePaysSupprimer,

  titreDemandeCreer
}
