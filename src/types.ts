interface IActivitesStatuts {
  id: string
  nom: string
  couleur: string
}

interface ISectionsElement {
  id: string
  nom: string
  type: string
  description?: string
  // TODO: pour type, utiliser un enum
  dateDebut?: string
  dateFin?: string
  frequencePeriodesIds?: number[]
}

interface ISections {
  id: string
  nom: string
  elements?: ISectionsElement[]
}

interface IActivitesTypes {
  id: string
  nom: string
  frequenceId: string
  sections?: ISections[]
  frequence?: IFrequences
  titresTypes: ITitresTypes[]
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
  associee?: boolean
}

interface IAnnees extends IPeriodes {}

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
  editable?: boolean
  titreTypeId?: string
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
  titresTypes: ITitresTypes[]
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
  utilisateurs?: IUtilisateurs[]
  titresTitulaire?: ITitres[]
  titresAmodiataire?: ITitres[]
  editable?: boolean
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
  editable?: boolean
  titreTypeId?: string
  customSections?: ISections[]
}

interface IFrequences {
  id: string
  nom: string
  periodesNom: 'annees' | 'trimestres' | 'mois'
  annees?: IAnnees[]
  trimestres?: ITrimestres[]
  mois?: IMois[]
}

export interface IGeoJson {
  type: string
  geometry?: IGeometry
  bbox?: number[]
  properties?: { [id: string]: string | number }
  features?: IGeoJson[]
}

export interface IGeometry {
  type: string
  coordinates: number[] | number[][] | number[][][] | number[][][][]
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

interface IMois extends IPeriodes {
  trimestreId?: string
  trimestre?: ITrimestres
}

interface IPays {
  id: string
  nom: string
  regions?: IRegions[]
}

interface IPeriodes {
  id: number
  nom: string
  frequenceId: string
  frequence: IFrequences
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

interface ITitresStatuts {
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
  typeId: string
  type?: IActivitesTypes
  statutId: string
  statut?: IActivitesStatuts
  frequencePeriodeId: number
  annee: number
  periode?: IAnnees | ITrimestres | IMois
  utilisateurId: string
  utilisateur?: IUtilisateurs
  dateSaisie?: string
  contenu?: ITitresActivitesContenu
  sections?: ISections[]
  editable?: boolean
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
  titreType: ITitresTypes
  etapes?: ITitresEtapes[]
  phase?: ITitresPhases
  annulationDemarche?: ITitresDemarches
  parents?: ITitresDemarches[]
  enfants?: ITitresDemarches[]
  editable?: boolean
  supprimable?: boolean
}

interface ITitresDocuments {
  id: string
  titreEtapeId: string
  typeId: string
  type?: IDocumentsTypes
  fichierTypeId: string
  jorf?: string
  nor?: string
  url?: string
  uri?: string
  nom?: string
  fichier?: boolean
  public?: boolean
  editable?: boolean
  supprimable?: boolean
}

interface ITitresEtapes {
  id: string
  titreDemarcheId: string
  typeId: string
  type?: IEtapesTypes
  statutId: string
  statut?: IEtapesStatuts
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
  substances?: ISubstances[]
  points?: ITitresPoints[]
  geojsonMultiPolygon?: IGeoJson
  geojsonPoints?: IGeoJson
  titulaires?: IEntreprises[]
  amodiataires?: IEntreprises[]
  administrations?: IAdministrations[]
  documents?: ITitresDocuments[]
  communes?: ICommunes[]
  incertitudes?: ITitresIncertitudes
  volumeUnite?: IUnites
  engagementDevise?: IDevises
  pays?: IPays[]
  editable?: boolean
  supprimable?: boolean
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
  geoSysteme?: IGeoSystemes
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
  domaine?: IDomaines
  typeId: string
  type?: ITitresTypes
  statutId?: string
  statut?: ITitresStatuts
  references?: ITitresReferences[]
  dateDebut?: string
  dateFin?: string
  dateDemande?: string
  activitesDeposees?: number
  activitesEnConstruction?: number
  activitesAbsentes?: number
  substancesTitreEtapeId?: string
  substances?: ISubstances
  pointsTitreEtapeId?: string
  points?: ITitresPoints[]
  geojsonMultiPolygon?: IGeoJson
  geojsonPoints?: IGeoJson
  titulairesTitreEtapeId?: string
  titulaires?: IEntreprises[]
  amodiatairesTitreEtapeId?: string
  amodiataires?: IEntreprises[]
  administrationsTitreEtapeId?: string
  administrationsLocales?: IAdministrations[]
  administrationsGestionnaires?: IAdministrations[]
  administrations?: IAdministrations[]
  surfaceTitreEtapeId?: string
  surfaceEtape?: ITitresEtapes
  surface?: number
  volumeTitreEtapeId?: string
  volumeEtape?: ITitresEtapes
  volume?: number
  volumeUniteIdTitreEtapeId?: string
  volumeUnite?: IUnites
  communesTitreEtapeId?: string
  communes?: ICommunes[]
  engagementTitreEtapeId?: string
  engagementEtape?: ITitresEtapes
  engagement?: number
  engagementDeviseIdTitreEtapeId?: string
  engagementDevise?: IDevises
  demarches?: ITitresDemarches[]
  activites?: ITitresActivites[]
  pays?: IPays[]
  editable?: boolean
  supprimable?: boolean
}

interface ITrimestres extends IPeriodes {
  mois?: IMois[]
}

interface ITitresTypes {
  id: string
  domaineId: string
  typeId: number
  archive?: boolean
  type: ITitresTypesTypes
  demarchesTypes?: IDemarchesTypes[]
}

interface ITitresTypesTypes {
  id: string
  nom: string
  ordre: number
}

interface IUnites {
  id: string
  nom: string
  symbole: string
}

interface IUsers extends IUtilisateurs {
  sections: { [id: string]: boolean }
}

interface IUtilisateurs {
  id: string
  email?: string
  motDePasse?: string
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
  editable: boolean
  supprimable: boolean
  permissionEditable: boolean
}

interface RequestContext {
  user: IUtilisateurs
}

export {
  IActivitesStatuts,
  IActivitesTypes,
  ISections,
  ISectionsElement,
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
  IPeriodes,
  IPhasesStatuts,
  IReferencesTypes,
  IRegions,
  IRestrictionsDomaines,
  IRestrictionsTypesAdministrations,
  IRestrictionsTypesStatuts,
  IRestrictionsTypesStatutsAdministrations,
  IRestrictionsEtapesTypes,
  IRestrictionsEtapesTypesAdministrations,
  ITitresStatuts,
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
  ITitresTypes,
  ITitresTypesTypes,
  IUnites,
  IUsers,
  IUtilisateurs,
  RequestContext
}
