/* eslint-disable no-undef */
import { FileUpload } from 'graphql-upload'

interface IFields {
  [key: string]: IFields
}

interface Index<T> {
  [id: string]: T
}

interface IColonne<T> {
  id: T
  relation?: string
  groupBy?: boolean | string[]
}

type IPropId =
  | 'points'
  | 'titulaires'
  | 'amodiataires'
  | 'administrations'
  | 'substances'
  | 'communes'
  | 'forets'
  | 'surface'

type ITitreColonneId =
  | 'nom'
  | 'domaine'
  | 'coordonnees'
  | 'type'
  | 'statut'
  | 'activites'

type ITitreDemarcheColonneId =
  | 'titreNom'
  | 'titreDomaine'
  | 'titreType'
  | 'titreStatut'
  | 'type'
  | 'statut'

type ITitreActiviteColonneId = 'titreNom' | 'titulaire' | 'periode' | 'statut'

type IUtilisateursColonneId = 'nom' | 'prenom' | 'email' | 'permission' | 'lien'
type IEntrepriseColonneId = 'nom' | 'siren'
type IAdministrationColonneId = 'abreviation' | 'nom' | 'type'

interface IActiviteStatut {
  id: string
  nom: string
  couleur: string
}

interface IContenuId {
  sectionId: string
  elementId: string
}

type IContenuValeur = string | number | string[] | boolean

interface IContenuElement {
  [elementId: string]: IContenuValeur
}

interface IContenu {
  [sectionId: string]: IContenuElement
}

interface IPropsTitreEtapesIds {
  [elementId: string]: string
}

interface IContenusTitreEtapesIds {
  [sectionId: string]: IPropsTitreEtapesIds
}

interface IHeritageProps {
  [elementId: string]: {
    actif: boolean
    etapeId?: string | null
    etape?: ITitreEtape
  }
}

interface IHeritageContenu {
  [sectionId: string]: IHeritageProps
}

interface ISection {
  id: string
  nom?: string
  elements?: ISectionElement[] | null
}

type IValeurMetasNom = 'devises' | 'unites'

type ISectionElementType =
  | 'integer'
  | 'number'
  | 'text'
  | 'date'
  | 'textarea'
  | 'checkbox'
  | 'checkboxes'
  | 'select'
  | 'radio'

interface ISectionElement {
  id: string
  nom: string
  type: ISectionElementType
  description?: string | null
  dateDebut?: string | null
  dateFin?: string | null
  periodesIds?: number[] | null
  // à supprimer après la migration
  frequencePeriodesIds?: number[] | null
  valeurs?: { id: string; nom: string }[] | null
  valeursMetasNom?: IValeurMetasNom
  referenceUniteRatio?: number
  optionnel?: boolean
}

interface IActiviteTypeDocumentType extends IDocumentType {
  optionnel: boolean
}

interface IActiviteType {
  id: string
  nom: string
  frequenceId: string
  dateDebut: string
  delaiMois: number
  titresTypes: ITitreType[]
  documentsTypes: IActiviteTypeDocumentType[]
  sections: ISection[]
  frequence?: IFrequence | null
  pays?: IPays[] | null
  administrations?: IAdministration[] | null
  satisfactionUrl: string
  email?: string | null
  modification?: boolean | null
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
  type?: IAdministrationType
  service?: string | null
  url?: string | null
  email?: string | null
  telephone?: string | null
  adresse1?: string | null
  adresse2?: string | null
  codePostal?: string | null
  commune?: string | null
  cedex?: string | null
  departementId?: string | null
  regionId?: string | null
  abreviation?: string | null
  titresTypes?: (ITitreType & IAdministrationTitreType)[] | null
  titresTypesTitresStatuts?: IAdministrationTitreTypeTitreStatut[] | null
  titresTypesEtapesTypes?: IAdministrationTitreTypeEtapeType[] | null
  activitesTypes?: IActiviteType[] | null
  utilisateurs?: IUtilisateur[] | null
  gestionnaireTitres?: ITitre[] | null
  localeTitres?: ITitre[] | null
  associee?: boolean | null
  membre?: boolean
  modification?: boolean | null
}

interface IAnnee extends IPeriode {}

type IAreaType = 'communes' | 'forets'

interface IArea {
  id: string
  nom: string
  surface?: number | null
}

interface ICommune extends IArea {
  departement?: IDepartement | null
  departementId?: string | null
}

interface ICoordonnees {
  x: number
  y: number
}

interface IDemarcheStatut {
  id: string
  nom: string
  ordre: number
  couleur: string
}

interface IDemarcheType {
  id: string
  nom: string
  ordre: number
  duree?: boolean | null
  points?: boolean | null
  substances?: boolean | null
  titulaires?: boolean | null
  renouvelable?: boolean | null
  exception?: boolean | null
  etapesTypes: IEtapeType[]
  titreTypeId?: string | null
  unique?: boolean | null
  demarchesCreation?: boolean | null
}

interface IDepartement {
  id: string
  nom: string
  region?: IRegion | null
  regionId?: string | null
  communes?: ICommune[] | null
}

interface IDevise {
  id: string
  nom: string
  ordre: number
}

type IDocumentRepertoire = 'demarches' | 'activites' | 'entreprises' | 'travaux'

interface IDocumentType {
  id: string
  nom: string
  repertoire: IDocumentRepertoire
}

interface IDomaine {
  id: string
  nom: string
  description?: string
  ordre: number
  titresTypes: ITitreType[]
  titresCreation: boolean
}

interface IEntrepriseEtablissement {
  id: string
  entrepriseId: string
  dateDebut: string
  nom?: string | null
  legalSiret?: string | null
  dateFin?: string | null
}

interface IEntreprise {
  id: string
  nom: string
  paysId?: string | null
  legalSiren?: string | null
  legalEtranger?: string | null
  legalForme?: string | null
  categorie?: string | null
  dateCreation?: string | null
  adresse?: string | null
  codePostal?: string | null
  commune?: string | null
  cedex?: string | null
  email?: string | null
  telephone?: string | null
  url?: string | null
  etablissements?: IEntrepriseEtablissement[] | null
  utilisateurs?: IUtilisateur[] | null
  titulaireTitres?: ITitre[] | null
  amodiataireTitres?: ITitre[] | null
  modification?: boolean | null
  archive?: boolean | null
}

interface ITitreEntreprise extends IEntreprise {
  operateur?: boolean
}

interface IEtapeStatut {
  id: string
  nom: string
  description?: string
  couleur: string
}

interface IEtapeType {
  id: string
  nom: string
  ordre: number
  acceptationAuto?: boolean | null
  fondamentale?: boolean | null
  dateDebut?: string | null
  dateFin?: string | null
  sections?: ISection[] | null
  sectionsSpecifiques?: ISection[] | null
  etapesStatuts?: IEtapeStatut[] | null
  titreTypeId?: string | null
  demarcheTypeId?: string | null
  etapesCreation?: boolean | null
  unique?: boolean | null
}

interface IForet extends IArea {}

type IPeriodeNom = 'annees' | 'trimestres' | 'mois'

interface IFrequence {
  id: string
  nom: string
  periodesNom: IPeriodeNom
  annees?: IAnnee[] | null
  trimestres?: ITrimestre[] | null
  mois?: IMois[] | null
}

type IGeoJsonProperties = Index<string | number>

interface IGeoJson {
  type: string
  geometry?: IGeometry | null
  bbox?: number[] | null
  properties: IGeoJsonProperties
  features?: IGeoJson[] | null
}

interface IGeoJsonCentre {
  type: string
  geometry?: IGeometry | null
  properties: { etapeId?: string | null }
}

interface IApiGeoResult {
  communes: ICommune[]
  forets: IForet[]
}

interface IGeometry {
  type: string
  coordinates: number[] | number[][] | number[][][] | number[][][][]
}

interface IGeoSysteme {
  id: string
  definitionProj4: string
  nom: string
  ordre: number
  uniteId?: string | null
  unite: IUnite
  zone?: string | null
}

interface IGlobale {
  id: string
  valeur: boolean
}

interface IMois extends IPeriode {
  trimestreId?: string | null
  trimestre?: ITrimestre | null
}

interface IPays {
  id: string
  nom: string
  regions?: IRegion[] | null
}

interface IForet {
  id: string
  nom: string
}

interface IPeriode {
  id: number
  nom: string
  frequence: IFrequence
}

type IPermissionId =
  | 'super'
  | 'admin'
  | 'editeur'
  | 'lecteur'
  | 'entreprise'
  | 'defaut'

interface IPermission {
  id: IPermissionId
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
  pays?: IPays | null
  departements?: IDepartement[] | null
}

interface ITravauxType {
  id: string
  nom: string
  ordre: number
  etapesTypes: IEtapeType[]
  description?: string
  travauxCreation?: boolean | null
}

interface ITitreTypeEtapeType {
  titreTypeId: string
  titreType?: ITitreType | null
  etapeTypeId: string
  etapeType?: IEtapeType | null
}

interface ITitreTypeTitreStatut {
  titreTypeId: string
  titreType?: ITitreType | null
  titreStatutId: string
  titreStatut?: ITitreStatut | null
  publicLecture: boolean
}

interface ITitreTypeDemarcheType {
  titreTypeId: string
  demarcheTypeId: string
  dureeMax?: number | null
  acceptationImplicite?: boolean | null
  delaiImplicite?: number | null
  delaiRecours?: number | null
  legalRef?: string | null
  legaleLien?: string | null
  dateDebut?: string | null
  dateFin?: string | null
}

interface ITitreTypeActiviteType {
  titreTypeId: string
  titreType?: ITitreType | null
  activiteTypeId: string
  activiteType?: IActiviteType | null
}

interface IEtapeTypeEtapeStatut {
  etapeTypeId: string
  etapeStatutId: string
  ordre: number
}

interface ITravauxTypeEtapeType {
  travauxTypeId: string
  etapeTypeId: string
  ordre: number
}

interface IAdministrationTitreType {
  administrationId: string
  titreTypeId: string
  gestionnaire: boolean
  associee: boolean
}

interface IAdministrationTitreTypeTitreStatut extends ITitreTypeTitreStatut {
  administrationId: string
  titresModificationInterdit: boolean
  demarchesModificationInterdit: boolean
  etapesModificationInterdit: boolean
}

interface IAdministrationTitreTypeEtapeType extends ITitreTypeEtapeType {
  administrationId: string
  creationInterdit: boolean
  lectureInterdit: boolean
  modificationInterdit: boolean
}

interface IAdministrationActiviteType {
  administrationId: string
  activiteTypeId: string
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
  description?: string | null
  lien: string
}

interface ISubstanceLegale {
  id: string
  nom: string
  domaineId?: string | null
  description?: string | null
  substanceLegaleCodeId?: string | null
  domaine?: IDomaine | null
  code?: ISubstanceLegaleCode | null
  fiscales?: ISubstanceFiscale[] | null
}

interface ISubstanceFiscale {
  id: string
  nom: string
  description: string
  substanceLegaleId: string
  uniteId: string
  unite?: IUnite | null
}

interface ISubstance {
  id: string
  nom?: string | null
  symbole?: string | null
  gerep?: number | null
  description?: string | null
  legales: ISubstanceLegale[]
}

interface ITitreSubstance extends ISubstance {
  ordre?: number
}

interface ITitre {
  id: string
  nom: string
  domaineId: string
  domaine?: IDomaine | null
  typeId: string
  type?: ITitreType | null
  statutId?: string | null
  statut?: ITitreStatut | null
  references?: ITitreReference[] | null
  dateDebut?: string | null
  dateFin?: string | null
  dateDemande?: string | null
  activitesDeposees?: number | null
  activitesEnConstruction?: number | null
  activitesAbsentes?: number | null
  substances?: ITitreSubstance[] | null
  points?: ITitrePoint[] | null
  coordonnees?: ICoordonnees | null
  geojsonMultiPolygon?: IGeoJson | null
  geojsonPoints?: IGeoJson | null
  geojsonCentre?: IGeoJsonCentre | null
  titulaires?: ITitreEntreprise[] | null
  amodiataires?: ITitreEntreprise[] | null
  administrationsLocales?: IAdministration[] | null
  administrationsGestionnaires?: IAdministration[] | null
  administrations?: IAdministration[] | null
  surfaceEtape?: ITitreEtape | null
  surface?: number | null
  communes?: ICommune[] | null
  forets?: IForet[] | null
  demarches?: ITitreDemarche[] | null
  activites?: ITitreActivite[] | null
  travaux?: ITitreTravaux[] | null
  pays?: IPays[] | null
  modification?: boolean | null
  suppression?: boolean | null
  doublonTitreId?: string | null
  publicLecture?: boolean | null
  entreprisesLecture?: boolean | null
  travauxCreation?: boolean | null
  contenusTitreEtapesIds?: IContenusTitreEtapesIds | null
  propsTitreEtapesIds: IPropsTitreEtapesIds
  contenu?: IContenu | null
}

interface ITitreActivite {
  id: string
  titreId: string
  titre?: ITitre | null
  date: string
  typeId: string
  type?: IActiviteType | null
  statutId: string
  statut?: IActiviteStatut | null
  periodeId: number
  annee: number
  periode?: IAnnee | ITrimestre | IMois | null
  utilisateurId?: string | null
  utilisateur?: IUtilisateur | null
  dateSaisie?: string
  contenu?: IContenu | null
  sections: ISection[]
  documents?: IDocument[] | null
  modification?: boolean | null
  suppression?: boolean | null
  documentsCreation?: boolean | null
}

interface ITitreAdministrationGestionnaire {
  administrationId: string
  titreId: string
  associee?: boolean | null
}

interface ITitreAdministrationLocale {
  administrationId: string
  titreEtapeId: string
  associee?: boolean | null
  coordinateur?: boolean | null
}

interface ITitreArea {
  areaId: string
  titreEtapeId: string
  surface?: number | null
}

interface ITitreCommune {
  communeId: string
  titreEtapeId: string
  surface?: number | null
}

interface ITitreForet {
  foretId: string
  titreEtapeId: string
  surface?: number | null
}

interface ITitreEtapeJustificatif {
  documentId: string
  titreEtapeId: string
}

interface ITitreDemarcheOrTravaux {
  id: string
  titreId: string
  titre?: ITitre | null
  typeId: string
  type?: ITravauxType | IDemarcheType | null
  statutId?: string | null
  statut?: IDemarcheStatut | null
  ordre?: number | null
  etapes?: ITitreEtape[] | null
  publicLecture?: boolean | null
  entreprisesLecture?: boolean | null
  modification?: boolean | null
  etapesCreation?: boolean | null
  suppression?: boolean | null
}

interface ITitreDemarche extends ITitreDemarcheOrTravaux {
  type?: IDemarcheType | null
  ordre?: number | null
  titreType?: ITitreType | null
  phase?: ITitrePhase | null
  parents?: ITitreDemarche[] | null
  enfants?: ITitreDemarche[] | null
  publicLecture?: boolean | null
  entreprisesLecture?: boolean | null
  modification?: boolean | null
  etapesCreation?: boolean | null
  suppression?: boolean | null
}

interface ITitreTravaux extends ITitreDemarcheOrTravaux {
  type?: ITravauxType | null
}

interface IDocument {
  id: string
  typeId: string
  date: string
  description?: string | null
  type?: IDocumentType | null
  fichier?: boolean | null
  fichierTypeId?: string | null
  fichierNouveau?: { file: FileUpload } | null
  url?: string | null
  uri?: string | null
  jorf?: string | null
  nor?: string | null
  publicLecture?: boolean | null
  entreprisesLecture?: boolean | null
  titreEtapeId?: string | null
  etape?: ITitreEtape | null
  titreActiviteId?: string | null
  activite?: ITitreActivite | null
  titreTravauxEtapeId?: string | null
  travauxEtape?: ITitreTravauxEtape | null
  entrepriseId?: string | null
  entreprise?: IEntreprise | null
  etapesAssociees?: ITitreEtape[] | null
}

interface ITitreEtapeOrTitreTravauxEtape {
  id: string
  typeId: string
  type?: IEtapeType | null
  statutId: string
  statut?: IEtapeStatut | null
  ordre?: number | null
  date: string
  duree?: number | null
  surface?: number | null
  contenu?: IContenu | null
  documents?: IDocument[] | null
  modification?: boolean | null
  suppression?: boolean | null
}

interface ITitreEtape extends ITitreEtapeOrTitreTravauxEtape {
  titreDemarcheId: string
  demarche?: ITitreDemarche
  dateDebut?: string | null
  dateFin?: string | null
  substances?: ITitreSubstance[] | null
  points?: ITitrePoint[] | null
  geojsonMultiPolygon?: IGeoJson | null
  geojsonPoints?: IGeoJson | null
  titulaires?: ITitreEntreprise[] | null
  amodiataires?: ITitreEntreprise[] | null
  administrations?: IAdministration[] | null
  justificatifs?: IDocument[] | null
  communes?: ICommune[] | null
  forets?: IForet[] | null
  incertitudes?: ITitreIncertitudes | null
  pays?: IPays[] | null
  contenusTitreEtapesIds?: IContenusTitreEtapesIds | null
  heritageProps?: IHeritageProps | null
  heritageContenu?: IHeritageContenu | null
  justificatifsAssociation?: boolean | null
}

interface ITitreTravauxEtape extends ITitreEtapeOrTitreTravauxEtape {
  titreTravauxId: string
}

interface ITitreEtapeFiltre {
  typeId: string
  statutId?: string
  dateDebut?: string
  dateFin?: string
}

interface ITitreIncertitudes {
  date?: boolean | null
  dateDebut?: boolean | null
  dateFin?: boolean | null
  duree?: boolean | null
  surface?: boolean | null
  points?: boolean | null
  substances?: boolean | null
  titulaires?: boolean | null
  amodiataires?: boolean | null
  administrations?: boolean | null
}

interface ITitrePhase {
  titreDemarcheId: string
  statutId: string
  dateDebut: string
  dateFin: string
  statut?: IPhaseStatut
}

interface ITitrePoint {
  id: string
  titreEtapeId: string
  nom?: string | null
  description?: string | null
  groupe: number
  contour: number
  point: number
  references: ITitrePointReference[]
  coordonnees: ICoordonnees
  lot?: number | null
  securite?: boolean | null
  subsidiaire?: boolean | null
}

interface ITitrePointReference {
  id: string
  titrePointId: string
  geoSystemeId: string
  geoSysteme?: IGeoSysteme | null
  coordonnees: ICoordonnees
  opposable?: boolean | null
}

interface ITitreReference {
  titreId: string
  typeId: string
  nom: string
  type?: IReferenceType | null
}

interface ITrimestre extends IPeriode {
  mois?: IMois[]
}

type ICacheId = 'matomo'

interface ICache {
  id: ICacheId
  valeur: any
}

interface ITitreType {
  id: string
  domaineId: string
  typeId: string
  archive?: boolean | null
  type: ITitreTypeType
  demarchesTypes?: IDemarcheType[] | null
  autorisationsTitresStatuts?: ITitreTypeTitreStatut[] | null
  contenuIds?: IContenuId[] | null
  sections?: ISection[] | null
  gestionnaire?: boolean | null
  associee?: boolean | null
  titresCreation?: boolean | null
}

interface ITitreTypeType {
  id: string
  nom: string
  ordre: number
}

interface ITitreTypeDemarcheTypeEtapeType {
  titreTypeId: string
  demarcheTypeId: string
  etapeTypeId: string

  sections?: ISection[] | null
  ordre: number
}

interface IUnite {
  id: string
  nom: string
  symbole: string
  referenceUniteRatio?: number
  referenceUniteId?: string | null
  referenceUnite?: IUnite | null
}

interface IUser extends IUtilisateur {
  sections: Index<boolean>
}

interface IUtilisateur {
  id: string
  email?: string | null
  motDePasse?: string | null
  nom?: string | null
  prenom?: string | null
  telephoneFixe?: string | null
  telephoneMobile?: string | null
  permissionId: IPermissionId
  // TODO: définir une interface IUtilisateurPreferences
  preferences?: any | null
  permission: IPermission
  administrations?: IAdministration[] | null
  entreprises?: IEntreprise[] | null
  modification?: boolean | null
  suppression?: boolean | null
  permissionModification?: boolean | null
  entreprisesCreation?: boolean | null
  refreshToken?: string | null
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type IUtilisateurCreation = PartialBy<Omit<IUtilisateur, 'id'>, 'permissionId'>

interface IToken {
  user?: ITokenUser
}

interface ITokenUser {
  id: string
  email: string
  iat: number
}

type IFormat = 'xlsx' | 'csv' | 'ods' | 'geojson' | 'json' | 'pdf'

interface IDefinition {
  id: string
  nom: string
  ordre: number
  slug: string
  table?: string
  description?: string | null
  couleur?: string
  elements?: IDefinition[]
}

export {
  Index,
  IFields,
  IFormat,
  IActiviteStatut,
  IActiviteType,
  ISection,
  ISectionElement,
  IAdministration,
  IAdministrationType,
  IAnnee,
  ICommune,
  IArea,
  IAreaType,
  IContenu,
  IContenuElement,
  IContenuValeur,
  IContenusTitreEtapesIds,
  ICoordonnees,
  IDemarcheStatut,
  IDemarcheType,
  IDepartement,
  IDevise,
  IDocumentType,
  IDocumentRepertoire,
  IDomaine,
  IEntreprise,
  IEntrepriseEtablissement,
  IEtapeStatut,
  IEtapeType,
  IForet,
  IFrequence,
  IGeoJson,
  IGeoJsonProperties,
  IApiGeoResult,
  IGeometry,
  IGeoSysteme,
  IGlobale,
  IMois,
  IPays,
  IPermission,
  IPermissionId,
  IPeriode,
  IPhaseStatut,
  IReferenceType,
  IRegion,
  ITitreTypeTitreStatut,
  ITitreTypeDemarcheType,
  ITitreTypeActiviteType,
  IEtapeTypeEtapeStatut,
  ITravauxTypeEtapeType,
  IAdministrationTitreType,
  IAdministrationTitreTypeTitreStatut,
  IAdministrationTitreTypeEtapeType,
  IAdministrationActiviteType,
  ITitreStatut,
  ISubstance,
  ISubstanceLegale,
  ISubstanceLegaleCode,
  ISubstanceFiscale,
  ITitreSubstance,
  ITitre,
  ITitreActivite,
  ITitreAdministrationGestionnaire,
  ITitreAdministrationLocale,
  ITitreCommune,
  ITitreForet,
  ITitreArea,
  ITitreDemarche,
  ITitreDemarcheOrTravaux,
  IDocument,
  ITitreEtape,
  ITitreEtapeOrTitreTravauxEtape,
  ITitreEtapeJustificatif,
  ITitreEtapeFiltre,
  ITitreIncertitudes,
  ITitrePhase,
  ITitrePoint,
  ITitrePointReference,
  ITitreReference,
  ITitreTravaux,
  ITitreTravauxEtape,
  ITitreType,
  ITitreTypeType,
  ITitreTypeDemarcheTypeEtapeType,
  ITitreEntreprise,
  ITravauxType,
  ITrimestre,
  IUnite,
  IUser,
  IUtilisateur,
  IUtilisateurCreation,
  IPropId,
  IToken,
  ITokenUser,
  ITitreColonneId,
  ITitreDemarcheColonneId,
  ITitreActiviteColonneId,
  IUtilisateursColonneId,
  IEntrepriseColonneId,
  IAdministrationColonneId,
  IColonne,
  IDefinition,
  IContenuId,
  IPropsTitreEtapesIds,
  IHeritageProps,
  IHeritageContenu,
  ICache,
  ICacheId
}
