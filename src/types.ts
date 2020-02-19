import { FileUpload } from 'graphql-upload'

interface Index {
  [id: string]: any
}

interface IActiviteStatut {
  id: string
  nom: string
  couleur: string
}

interface ISection {
  id: string
  nom: string
  elements?: ISectionElement[]
}

interface ISectionElement {
  id: string
  nom: string
  type: string
  description?: string
  dateDebut?: string
  dateFin?: string
  frequencePeriodesIds?: number[]
  valeurs?: { [id: string]: string }
}

interface IActiviteType {
  id: string
  nom: string
  frequenceId: string
  sections?: ISection[]
  frequence?: IFrequence
  titresTypes: ITitreType[]
  pays?: IPays[]
  administrations?: IAdministration[]
}

interface IAdministrationType {
  id: string
  nom: string
  ordre: number
}

interface IAdministration {
  id: string
  typeId: string
  nom: string
  type: IAdministrationType
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
  domaines?: IDomaine[]
  utilisateurs?: IUtilisateur[]
  titresAdministrationsGestionnaires?: ITitre[]
  titresAdministrationsLocales?: ITitre[]
  associee?: boolean
  membre?: boolean
}

interface IAnnee extends IPeriode {}

interface ICommune {
  id: string
  nom: string
  departement?: IDepartement
  surface?: number
}

type IContenuValeur = string | number | string[] | boolean

interface IContenu {
  [id: string]: IContenuElement
}

interface IContenuElement {
  [id: string]: IContenuValeur
}

interface ICoordonnees {
  x: number
  y: number
}

interface IDemarcheStatut {
  id: string
  nom: string
  couleur: string
}

interface IDemarcheType {
  id: string
  nom: string
  ordre?: number
  duree?: boolean
  points?: boolean
  substances?: boolean
  titulaires?: boolean
  renouvelable?: boolean
  exception?: boolean
  etapesTypes: IEtapeType[]
  titreTypeId?: string
  editable?: boolean
  unique?: boolean
}

interface IDepartement {
  id: string
  nom: string
  region?: IRegion
  communes?: ICommune[]
}

interface IDevise {
  id: string
  nom: string
  ordre: number
}

interface IDocumentType {
  id: string
  nom: string
}

interface IDomaine {
  id: string
  nom: string
  ordre: number
  titresTypes: ITitreType[]
}

interface IEntrepriseEtablissement {
  id: string
  entrepriseId: string
  dateDebut: string
  nom?: string
  legalSiret?: string
  dateFin?: string
}

interface IEntreprise {
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
  etablissements?: IEntrepriseEtablissement[]
  utilisateurs?: IUtilisateur[]
  titresTitulaire?: ITitre[]
  titresAmodiataire?: ITitre[]
  editable?: boolean
}

interface IEtapeStatut {
  id: string
  nom: string
  couleur: string
}

interface IEtapeType {
  id: string
  nom: string
  acceptationAuto?: boolean
  fondamentale?: boolean
  dateDebut?: string
  dateFin?: string
  sections?: ISection[]
  sectionsSpecifiques?: ISection[]
  etapesStatuts?: IEtapeStatut[]
  titreTypeId?: string
  demarcheTypeId?: string
  editable?: boolean
  unique?: boolean
}

interface IFrequence {
  id: string
  nom: string
  periodesNom: 'annees' | 'trimestres' | 'mois'
  annees?: IAnnee[]
  trimestres?: ITrimestre[]
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

interface IGeoSysteme {
  id: string
  definitionProj4: string
  nom: string
  ordre: number
  uniteId?: string
  unite: IUnite
  zone?: string
}

interface IGlobale {
  id: string
  valeur: boolean
}

interface IMois extends IPeriode {
  trimestreId?: string
  trimestre?: ITrimestre
}

interface IPays {
  id: string
  nom: string
  regions?: IRegion[]
}

interface IPeriode {
  id: number
  nom: string
  frequenceId: string
  frequence: IFrequence
}

interface IPermission {
  id: string
  nom: string
  ordre: number
}

interface IPhaseStatut {
  id: string
  nom: string
  couleur: string
}

interface IReferenceType {
  id: string
  nom: string
}

interface IRegion {
  id: string
  nom: string
  pays?: IPays
  departements?: IDepartement[]
}
interface IRestrictionDomaine {
  domaineId: string
  publicLectureInterdit: boolean
}

interface IRestrictionTypeStatut {
  titreTypeId: string
  titreStatutId: string
  publicLectureInterdit: boolean
}

interface IRestrictionTypeAdministration {
  typeId: string
  administrationId: string
  creationInterdit: boolean
}

interface IRestrictionTypeStatutAdministration {
  titreTypeId: string
  titreStatutId: string
  administrationId: string
  creationInterdit: boolean
  lectureInterdit: boolean
  modificationInterdit: boolean
}

interface IRestrictionEtapeType {
  etapeTypeId: string
  publicLectureInterdit: boolean
  entreprisesLectureInterdit: boolean
}

interface IRestrictionEtapeTypeAdministration {
  etapeTypeId: string
  administrationId: string
  creationInterdit: boolean
  lectureInterdit: boolean
  modificationInterdit: boolean
}

interface ITitreStatut {
  id: string
  nom: string
  couleur: string
  ordre: number
}

interface ISubstanceLegaleCode {
  id: string
  nom: string
  description?: string
  lien: string
}

interface ISubstanceLegale {
  id: string
  nom: string
  domaineId?: string
  description?: string
  substanceLegalCodeId?: string
  domaine?: IDomaine
  code?: ISubstanceLegaleCode
}

interface ISubstance {
  id: string
  nom?: string
  symbole?: string
  gerep?: number
  description?: string
  substanceLegaleId: string
  substanceLegale: ISubstanceLegale
}

interface ITitre {
  id: string
  nom: string
  domaineId: string
  domaine?: IDomaine
  typeId: string
  type?: ITitreType
  statutId?: string
  statut?: ITitreStatut
  references?: ITitreReference[]
  dateDebut?: string
  dateFin?: string
  dateDemande?: string
  activitesDeposees?: number
  activitesEnConstruction?: number
  activitesAbsentes?: number
  substancesTitreEtapeId?: string
  substances?: ISubstance
  pointsTitreEtapeId?: string
  points?: ITitrePoint[]
  geojsonMultiPolygon?: IGeoJson
  geojsonPoints?: IGeoJson
  titulairesTitreEtapeId?: string
  titulaires?: IEntreprise[]
  amodiatairesTitreEtapeId?: string
  amodiataires?: IEntreprise[]
  administrationsTitreEtapeId?: string
  administrationsLocales?: IAdministration[]
  administrationsGestionnaires?: IAdministration[]
  administrations?: IAdministration[]
  surfaceTitreEtapeId?: string
  surfaceEtape?: ITitreEtape
  surface?: number
  volumeTitreEtapeId?: string
  volumeEtape?: ITitreEtape
  volume?: number
  volumeUniteIdTitreEtapeId?: string
  volumeUnite?: IUnite
  communesTitreEtapeId?: string
  communes?: ICommune[]
  engagementTitreEtapeId?: string
  engagementEtape?: ITitreEtape
  engagement?: number
  engagementDeviseIdTitreEtapeId?: string
  engagementDevise?: IDevise
  demarches?: ITitreDemarche[]
  activites?: ITitreActivite[]
  pays?: IPays[]
  editable?: boolean
  supprimable?: boolean
  doublonTitreId?: string
}

interface ITitreActivite {
  id: string
  titreId: string
  titre?: ITitre
  date: string
  typeId: string
  type?: IActiviteType
  statutId: string
  statut?: IActiviteStatut
  frequencePeriodeId: number
  annee: number
  periode?: IAnnee | ITrimestre | IMois
  utilisateurId: string
  utilisateur?: IUtilisateur
  dateSaisie?: string
  contenu?: IContenu
  sections?: ISection[]
  editable?: boolean
}

interface ITitreActiviteInput {
  id: string
  statutId: string
  contenu?: IContenu
}

interface ITitreAdministrationsGestionnaire {
  administrationId: string
  titreId: string
  associee?: boolean
}

interface ITitreAdministrationLocale {
  administrationId: string
  titreId: string
  associee?: boolean
  coordinateur?: boolean
}

interface ITitreCommune {
  communeId: string
  titreEtapeId: string
  surface?: number
}

interface ITitreDemarche {
  id: string
  titreId: string
  typeId: string
  type?: IDemarcheType
  statutId?: string
  statut?: IDemarcheStatut
  ordre?: number
  annulationTitreDemarcheId?: string
  titreType?: ITitreType
  etapes?: ITitreEtape[]
  phase?: ITitrePhase
  annulationDemarche?: ITitreDemarche
  parents?: ITitreDemarche[]
  enfants?: ITitreDemarche[]
  editable?: boolean
  supprimable?: boolean
}

interface ITitreDemarcheInput {
  id?: string
  typeId: string
  titreId: string
}

interface ITitreDocument {
  id: string
  titreEtapeId: string
  typeId: string
  type?: IDocumentType
  jorf?: string
  nor?: string
  url?: string
  uri?: string
  nom?: string
  fichier?: boolean
  fichierTypeId?: string
  fichierNouveau?: { file: FileUpload }
  public?: boolean
  editable?: boolean
  supprimable?: boolean
}

interface ITitreEtape {
  id: string
  titreDemarcheId: string
  typeId: string
  type?: IEtapeType
  statutId: string
  statut?: IEtapeStatut
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
  contenu?: IContenu
  substances?: ISubstance[]
  points?: ITitrePoint[]
  geojsonMultiPolygon?: IGeoJson
  geojsonPoints?: IGeoJson
  titulaires?: IEntreprise[]
  amodiataires?: IEntreprise[]
  administrations?: IAdministration[]
  documents?: ITitreDocument[]
  communes?: ICommune[]
  incertitudes?: ITitreIncertitudes
  volumeUnite?: IUnite
  engagementDevise?: IDevise
  pays?: IPays[]
  editable?: boolean
  supprimable?: boolean
}

interface ITitreIncertitudes {
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

interface ITitrePhase {
  titreDemarcheId: string
  statutId: string
  dateDebut: string
  dateFin: string
  statut: IPhaseStatut
}

interface ITitrePoint {
  id: string
  titreEtapeId: string
  nom?: string
  description?: string
  groupe: number
  contour: number
  point: number
  references: ITitrePointReference[]
  coordonnees: ICoordonnees
  lot?: number
  securite?: boolean
  subsidiaire?: boolean
}

interface ITitrePointReference {
  id: string
  titrePointId: string
  geoSystemeId: string
  geoSysteme?: IGeoSysteme
  coordonnees: ICoordonnees
  opposable?: boolean
}

interface ITitreReference {
  titreId: string
  typeId: string
  nom: string
  type?: IReferenceType
}

interface ITrimestre extends IPeriode {
  mois?: IMois[]
}

interface ITitreType {
  id: string
  domaineId: string
  typeId: string
  archive?: boolean
  type: ITitreTypeType
  demarchesTypes?: IDemarcheType[]
  editable?: boolean
}

interface ITitreTypeType {
  id: string
  nom: string
  ordre: number
}

interface IUnite {
  id: string
  nom: string
  symbole: string
}

interface IUser extends IUtilisateur {
  sections: { [id: string]: boolean }
}

interface IUtilisateur {
  id: string
  email?: string
  motDePasse?: string
  nom?: string
  prenom?: string
  telephoneFixe?: string
  telephoneMobile?: string
  permissionId: string
  // TODO: définir une interface IUtilisateurPreferences
  preferences?: any
  permission: IPermission
  administrations?: IAdministration[]
  entreprises?: IEntreprise[]
  editable?: boolean
  supprimable?: boolean
  permissionEditable?: boolean
}

interface IToken {
  user?: ITokenUser
}

interface ITokenUser {
  id: string
  email: string
  iat: number
}

type TitreProp =
  | 'pointsTitreEtapeId'
  | 'titulairesTitreEtapeId'
  | 'amodiatairesTitreEtapeId'
  | 'administrationsTitreEtapeId'
  | 'surfaceTitreEtapeId'
  | 'volumeTitreEtapeId'
  | 'volumeUniteIdTitreEtapeId'
  | 'substancesTitreEtapeId'
  | 'communesTitreEtapeId'
  | 'engagementTitreEtapeId'
  | 'engagementDeviseIdTitreEtapeId'

type TitreEtapeProp =
  | 'points'
  | 'titulaires'
  | 'amodiataires'
  | 'administrations'
  | 'surface'
  | 'volume'
  | 'volumeUniteId'
  | 'substances'
  | 'communes'
  | 'engagement'
  | 'engagementDeviseId'

export {
  Index,
  IActiviteStatut,
  IActiviteType,
  ISection,
  ISectionElement,
  IAdministration,
  IAdministrationType,
  IAnnee,
  ICommune,
  IContenu,
  IContenuElement,
  IContenuValeur,
  ICoordonnees,
  IDemarcheStatut,
  IDemarcheType,
  IDepartement,
  IDevise,
  IDocumentType,
  IDomaine,
  IEntreprise,
  IEntrepriseEtablissement,
  IEtapeStatut,
  IEtapeType,
  IFrequence,
  IGeoSysteme,
  IGlobale,
  IMois,
  IPays,
  IPermission,
  IPeriode,
  IPhaseStatut,
  IReferenceType,
  IRegion,
  IRestrictionDomaine,
  IRestrictionTypeAdministration,
  IRestrictionTypeStatut,
  IRestrictionTypeStatutAdministration,
  IRestrictionEtapeType,
  IRestrictionEtapeTypeAdministration,
  ITitreStatut,
  ISubstance,
  ISubstanceLegale,
  ISubstanceLegaleCode,
  ITitre,
  ITitreActivite,
  ITitreAdministrationsGestionnaire,
  ITitreAdministrationLocale,
  ITitreCommune,
  ITitreDemarche,
  ITitreDocument,
  ITitreEtape,
  ITitreIncertitudes,
  ITitrePhase,
  ITitrePoint,
  ITitrePointReference,
  ITitreReference,
  ITitreType,
  ITitreTypeType,
  ITrimestre,
  IUnite,
  IUser,
  IUtilisateur,
  TitreProp,
  TitreEtapeProp,
  IToken,
  ITokenUser
}
