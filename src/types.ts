interface IActivitesStatuts {
  id: string
  nom: string
  couleur: string
}

interface IActivitesTypesSectionsElement {
  id: string
  nom: string
  type: string
  description?: string
  // TODO: pour type, utiliser un enum
  dateDebut?: string
  dateFin?: string
}

interface IActivitesTypesSection {
  id: string
  nom: string
  elements: IActivitesTypesSectionsElement[]
}

interface IActivitesTypes {
  id: string
  nom: string
  frequenceId: string
  sections: IActivitesTypesSection[]
  frequence: IFrequences
  types?: ITypes[]
  pays?: IPays[]
  administrations?: IAdministrations
}

interface IAdministrationsTypes {
  id: string
  nom: string
  ordre: number
}

interface IAdministrations {
  id: string
  typeId: string
  nom: string
  type: IAdministrationsTypes
  service?: string
  url?: string
  email?: string
  telephone?: string
  adresse1?: string
  adresse2?: string
  codePostal?: string
  commune?: string
  cedex?: string
  departementId?: string
  regionId?: string
  abreviation?: string
  domaines?: IDomaines[]
  utilisateurs?: IUtilisateurs[]
  titresAdministrationsGestionnaires?: ITitres[]
  titresAdministrationsLocales?: ITitres[]
}

interface IAnnees {
  id: string
  nom: string
  frequenceId: string
  frequence: IFrequences
}

interface ICommunes {
  id: string
  nom: string
  departement?: IDepartements
  surface?: number
}

interface IDemarchesStatuts {
  id: string
  nom: string
  couleur: string
}

interface IDemarchesTypes {
  id: string
  nom: string
  ordre?: number
  duree?: boolean
  points?: boolean
  substances?: boolean
  titulaires?: boolean
  renouvelable?: boolean
  exception?: boolean
  etapesTypes: IEtapesTypes[]
}

interface IDepartements {
  id: string
  nom: string
  region?: IRegions
  communes?: ICommunes[]
}

interface IDevises {
  id: string
  nom: string
  ordre: number
}

interface IDocumentsTypes {
  id: string
  nom: string
}

interface IDomaines {
  id: string
  nom: string
  ordre: number
  types: ITypes
}

interface IEntreprisesEtablissements {
  id: string
  entrepriseId: string
  dateDebut: string
  nom?: string
  legalSiret?: string
  dateFin?: string
}

interface IEntreprises {
  id: string
  nom: string
  paysId?: string
  legalSiren?: string
  legalEtranger?: string
  legalForme?: string
  categorie?: string
  dateCreation?: string
  adresse?: string
  codePostal?: string
  commune?: string
  cedex?: string
  email?: string
  telephone?: string
  url?: string
  etablissements?: IEntreprisesEtablissements[]
  titresTitulaire?: ITitres
  titresAmodiataire?: ITitres
}

interface IEtapesStatuts {
  id: string
  nom: string
  couleur: string
}

interface IEtapesTypes {
  id: string
  nom: string
  acceptationAuto?: boolean
  fondamentale?: boolean
  dateDebut?: string
  dateFin?: string
  sections?: any
  etapesStatuts?: IEtapesStatuts[]
}

interface IFrequences {
  id: string
  nom: string
  annees: IAnnees[]
  trimestres: ITrimestres[]
  mois: IMois[]
}

interface IGeoSystemes {
  id: string
  definitionProj4: string
  nom: string
  ordre: number
  uniteId?: string
  unite: IUnites
  zone?: string
}

interface IGlobales {
  id: string
  valeur: boolean
}

interface IMois {
  id: string
  nom: string
  trimestreId: string
  frequenceId: string
  trimestre: ITrimestres
  frequence: IFrequences
}

interface IPays {
  id: string
  nom: string
  regions?: IRegions[]
}

interface IPermissions {
  id: string
  nom: string
  ordre?: number
}

interface IPhasesStatuts {
  id: string
  nom: string
  couleur: string
}

interface IReferencesTypes {
  id: string
  nom: string
}

interface IRegions {
  id: string
  nom: string
  pays?: IPays
  departements?: IDepartements[]
}
interface IRestrictionsDomaines {
  domaineId: string
  publicLectureInterdit: boolean
}

interface IRestrictionsTypesStatuts {
  typeId: string
  statutId: string
  publicLectureInterdit: boolean
}

interface IRestrictionsTypesAdministrations {
  typeId: string
  administrationId: string
  creationLectureInterdit: boolean
}

interface IRestrictionsTypesStatutsAdministrations {
  typeId: string
  statutId: string
  administrationId: string
  creationInterdit: boolean
  lectureInterdit: boolean
  modificationInterdit: boolean
}

interface IRestrictionsEtapesTypes {
  etapeTypeId: string
  publicLectureInterdit: boolean
  entreprisesLectureInterdit: boolean
}

interface IRestrictionsEtapesTypesAdministrations {
  etapeTypeId: string
  administrationId: string
  creationInterdit: boolean
  lectureInterdit: boolean
  modificationInterdit: boolean
}

interface IStatuts {
  id: string
  nom: string
  couleur: string
  ordre: number
}

interface ISubstancesLegalesCodes {
  id: string
  nom: string
  description?: string
  lien: string
}

interface ISubstancesLegales {
  id: string
  nom: string
  domaineId?: string
  description?: string
  substanceLegalCodeId?: string
  domaine?: IDomaines
  code?: ISubstancesLegalesCodes
}

interface ISubstances {
  id: string
  nom?: string
  symbole?: string
  gerep?: number
  description?: string
  substanceLegaleId: string
  substanceLegale: ISubstancesLegales
}

interface ITitresActivitesContenu {
  [id: string]: string | number | string[]
}

interface ITitresActivites {
  id: string
  titreId: string
  date: string
  utilisateurId?: string
  utilisateur: IUtilisateurs
  dateSaisie?: string
  contenu?: ITitresActivitesContenu
  activiteTypeId: string
  activiteType: IActivitesTypes
  activiteStatutId: string
  activiteStatut: IActivitesStatuts
  frequencePeriodeId: number
  annee: number
}

interface ITitresAdministrationsGestionnaires {
  administrationId: string
  titreId: string
  associee?: boolean
}

interface ITitresAdministrationsLocales {
  administrationId: string
  titreId: string
  associee?: boolean
  coordinateur?: boolean
}

interface ITitresCommunes {
  communeId: string
  titreEtapeId: string
  surface?: number
}

interface ITitresDemarches {
  id: string
  titreId: string
  typeId: string
  type: IDemarchesTypes
  statutId?: string
  ordre?: number
  annulationTitreDemarcheId?: string
  statut?: IDemarchesStatuts
  titreType: ITypes
  etapes?: ITitresEtapes[]
  phase?: ITitresPhases
  annulationDemarche?: ITitresDemarches
  parents?: ITitresDemarches[]
  enfants?: ITitresDemarches[]
}

interface ITitresDocuments {
  id: string
  type: IDocumentsTypes
  titreEtapeId: string
  typeId: string
  jorf?: string
  nor?: string
  url?: string
  uri?: string
  nom?: string
  fichier?: boolean
  fichierTypeId?: string
  public?: boolean
}

interface ITitresEtapes {
  id: string
  titreDemarcheId: string
  typeId: string
  type: IEtapesTypes
  statutId: string
  statut: IEtapesStatuts
  ordre?: number
  date: string
  dateDebut?: string
  dateFin?: string
  duree?: number
  surface?: number
  volume?: number
  volumeUniteId?: string
  engagement?: number
  engagementDeviseId?: string
  // TODO: ITitresEtapesContenus
  contenu?: any
  substances?: ISubstances
  points?: ITitresPoints
  titulaires?: IEntreprises
  amodiataires?: IEntreprises
  administrations?: IAdministrations
  documents?: ITitresDocuments
  communes?: ICommunes
  incertitudes?: ITitresIncertitudes
  volumeUnite?: IUnites
  engagementDevise?: IDevises
  pays?: IPays[]
}

interface ITitresIncertitudes {
  titreEtapeId: string
  date?: boolean
  dateDebut?: boolean
  dateFin?: boolean
  duree?: boolean
  surface?: boolean
  volume?: boolean
  engagement?: boolean
  points?: boolean
  substances?: boolean
  titulaires?: boolean
  amodiataires?: boolean
  administrations?: boolean
}

interface ITitresPhases {
  titreDemarcheId: string
  statutId: string
  dateDebut: string
  dateFin: string
  statut: IPhasesStatuts
}

interface ITitresPointsReferences {
  id: string
  titrePointId: string
  geoSystemeId: string
  coordonnees: ICoordonnees
  opposable?: boolean
  geoSysteme: IGeoSystemes
  unite: IUnites
}

interface ICoordonnees {
  x: number
  y: number
}

interface ITitresPoints {
  id: string
  titreEtapeId: string
  nom?: string
  description?: string
  coordonnees: ICoordonnees
  groupe: number
  contour: number
  point: number
  lot?: number
  securite?: boolean
  subsidiaire?: boolean
  references: ITitresPointsReferences[]
}

interface ITitresReferences {
  titreId: string
  typeId: string
  nom: string
  type: IReferencesTypes
}

interface ITitres {
  id: string
  nom: string
  domaineId: string
  typeId: string
  domaine: IDomaines
  type: ITypes
  statut: IStatuts
  statutId?: string
  dateDebut?: string
  dateFin?: string
  dateDemande?: string
  activitesDeposees?: number
  activitesEnConstruction?: number
  activitesAbsentes?: number
  substancesTitreEtapeId?: string
  pointsTitreEtapeId?: string
  titulairesTitreEtapeId?: string
  amodiatairesTitreEtapeId?: string
  administrationsTitreEtapeId?: string
  surfaceTitreEtapeId?: string
  volumeTitreEtapeId?: string
  volumeUniteIdTitreEtapeId?: string
  communesTitreEtapeId?: string
  engagementTitreEtapeId?: string
  engagementDeviseIdTitreEtapeId?: string
  demarches?: ITitresDemarches
  surfaceEtape?: ITitresEtapes
  volumeEtape?: ITitresEtapes
  volumeUnite?: ITitresEtapes
  engagementEtape?: ITitresEtapes
  engagementDevise?: IDevises
  substances?: ISubstances
  points?: ITitresPoints[]
  titulaires?: IEntreprises[]
  amodiataires?: IEntreprises[]
  administrationsGestionnaires?: IAdministrations[]
  administrationsLocales?: IAdministrations[]
  communes?: ICommunes[]
  activites?: ITitresActivites[]
  references?: ITitresReferences[]
  pays?: IPays[]
}

interface ITrimestres {
  id: string
  nom: string
  frequenceId: string
  frequence: IFrequences
  mois: IMois[]
}

interface ITypes {
  id: string
  nom: string
  ordre: number
  demarchesTypes?: IDemarchesTypes[]
}

interface IUnites {
  id: string
  nom: string
  symbole: string
}

interface IUtilisateurs {
  id: string
  email?: string
  motDePasse: string
  nom?: string
  prenom?: string
  telephoneFixe?: string
  telephoneMobile?: string
  permissionId: string
  // TODO: définir une interface IUtilisateurPreferences ?
  preferences?: any
  permission: IPermissions
  administrations?: IAdministrations[]
  entreprises?: IEntreprises[]
}

export {
  IActivitesStatuts,
  IActivitesTypes,
  IActivitesTypesSection,
  IAdministrationsTypes,
  IAdministrations,
  IAnnees,
  ICommunes,
  ICoordonnees,
  IDemarchesStatuts,
  IDemarchesTypes,
  IDepartements,
  IDevises,
  IDocumentsTypes,
  IDomaines,
  IEntreprisesEtablissements,
  IEntreprises,
  IEtapesStatuts,
  IEtapesTypes,
  IFrequences,
  IGeoSystemes,
  IGlobales,
  IMois,
  IPays,
  IPermissions,
  IPhasesStatuts,
  IReferencesTypes,
  IRegions,
  IRestrictionsDomaines,
  IRestrictionsTypesAdministrations,
  IRestrictionsTypesStatuts,
  IRestrictionsTypesStatutsAdministrations,
  IRestrictionsEtapesTypes,
  IRestrictionsEtapesTypesAdministrations,
  IStatuts,
  ISubstancesLegalesCodes,
  ISubstancesLegales,
  ISubstances,
  ITitresActivites,
  ITitresActivitesContenu,
  ITitresAdministrationsGestionnaires,
  ITitresAdministrationsLocales,
  ITitresCommunes,
  ITitresDemarches,
  ITitresDocuments,
  ITitresEtapes,
  ITitresIncertitudes,
  ITitresPhases,
  ITitresPointsReferences,
  ITitresPoints,
  ITitresReferences,
  ITitres,
  ITrimestres,
  ITypes,
  IUnites,
  IUtilisateurs
}
