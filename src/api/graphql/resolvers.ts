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
  etapeDeposer
} from './resolvers/titres-etapes'

import {
  documents,
  documentCreer,
  documentModifier,
  documentSupprimer
} from './resolvers/documents'

import {
  demarche,
  demarches,
  demarcheCreer,
  demarcheModifier,
  demarcheSupprimer
} from './resolvers/titres-demarches'

import {
  utilisateur,
  utilisateurs,
  moi,
  utilisateurConnecter,
  utilisateurDeconnecter,
  utilisateurCerbereConnecter,
  utilisateurCerbereUrlObtenir,
  utilisateurCreer,
  utilisateurCreationMessageEnvoyer,
  utilisateurModifier,
  utilisateurSupprimer,
  utilisateurMotDePasseModifier,
  utilisateurMotDePasseMessageEnvoyer,
  utilisateurMotDePasseInitialiser,
  utilisateurEmailMessageEnvoyer,
  utilisateurEmailModifier,
  newsletterInscrire
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
  documentTypeCreer,
  documentTypeModifier,
  referenceTypeModifier,
  geoSystemeModifier,
  pays
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
  titresTypesDemarchesTypesEtapesTypesDocumentsTypes,
  titreTypeDemarcheTypeEtapeTypeDocumentTypeModifier,
  titreTypeDemarcheTypeEtapeTypeDocumentTypeCreer,
  titreTypeDemarcheTypeEtapeTypeDocumentTypeSupprimer,
  titresTypesDemarchesTypesEtapesTypesJustificatifsTypes,
  titreTypeDemarcheTypeEtapeTypeJustificatifTypeModifier,
  titreTypeDemarcheTypeEtapeTypeJustificatifTypeCreer,
  titreTypeDemarcheTypeEtapeTypeJustificatifTypeSupprimer,
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
  administrationActiviteTypeModifier,
  administrationActiviteTypeEmailCreer,
  administrationActiviteTypeEmailSupprimer
} from './resolvers/administrations'
import {
  activite,
  activites,
  activitesAnnees,
  activiteModifier,
  activiteSupprimer,
  activiteDeposer
} from './resolvers/titres-activites'
import { statistiquesGlobales } from './resolvers/statistiques'
import { statistiquesGuyane } from './resolvers/statistiques-guyane'
import { statistiquesGranulatsMarins } from './resolvers/statistiques-granulats-marins'

import { titreDemandeCreer } from './resolvers/titre-demande'
import {
  pointsImporter,
  perimetreInformations,
  titreEtapePerimetreInformations
} from './resolvers/points'
import { journaux } from './resolvers/journaux'
import { utilisateurTitreAbonner } from './resolvers/utilisateurs-titres'

export default {
  //  types
  Json: GraphQLJSON,
  FileUpload: GraphQLUpload,

  //  queries
  etape,
  etapeHeritage,
  demarche,
  demarches,
  demarchesTypes,
  demarchesStatuts,
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
  titresTypesDemarchesTypesEtapesTypesDocumentsTypes,
  titresTypesDemarchesTypesEtapesTypesJustificatifsTypes,
  etapesTypesEtapesStatuts,
  etapesTypesDocumentsTypes,
  etapesTypesJustificatifsTypes,
  activitesTypes,
  activitesStatuts,
  activitesTypesTitresTypes,
  activitesTypesDocumentsTypes,
  activitesTypesPays,
  pays,
  pointsImporter,
  perimetreInformations,
  titreEtapePerimetreInformations,
  journaux,

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
  etapeDeposer,
  documentCreer,
  documentModifier,
  documentSupprimer,
  activiteModifier,
  activiteSupprimer,
  activiteDeposer,
  utilisateurConnecter,
  utilisateurDeconnecter,
  utilisateurCerbereConnecter,
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
  utilisateurTitreAbonner,
  newsletterInscrire,
  entrepriseCreer,
  entrepriseModifier,
  entrepriseTitreTypeModifier,
  entreprisesTitresCreation,
  administrationModifier,
  administrationTitreTypeModifier,
  administrationTitreTypeTitreStatutModifier,
  administrationTitreTypeEtapeTypeModifier,
  administrationActiviteTypeModifier,
  administrationActiviteTypeEmailCreer,
  administrationActiviteTypeEmailSupprimer,
  domaineModifier,
  definitionModifier,
  titreTypeTypeModifier,
  titreStatutModifier,
  demarcheTypeModifier,
  demarcheStatutModifier,
  phaseStatutModifier,
  etapeTypeModifier,
  etapeStatutModifier,
  deviseModifier,
  uniteModifier,
  administrationTypeModifier,
  permissionModifier,
  documentTypeCreer,
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

  titreTypeDemarcheTypeEtapeTypeDocumentTypeCreer,
  titreTypeDemarcheTypeEtapeTypeDocumentTypeModifier,
  titreTypeDemarcheTypeEtapeTypeDocumentTypeSupprimer,

  titreTypeDemarcheTypeEtapeTypeJustificatifTypeCreer,
  titreTypeDemarcheTypeEtapeTypeJustificatifTypeModifier,
  titreTypeDemarcheTypeEtapeTypeJustificatifTypeSupprimer,

  etapeTypeEtapeStatutModifier,
  etapeTypeEtapeStatutCreer,
  etapeTypeEtapeStatutSupprimer,

  etapeTypeDocumentTypeModifier,
  etapeTypeDocumentTypeCreer,
  etapeTypeDocumentTypeSupprimer,

  etapeTypeJustificatifTypeModifier,
  etapeTypeJustificatifTypeCreer,
  etapeTypeJustificatifTypeSupprimer,

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
