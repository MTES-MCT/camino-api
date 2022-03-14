/* eslint-disable no-undef */
import { FileUpload } from 'graphql-upload'

enum DemarchesStatutsTypes {
  Accepte = 'acc',
  ClasseSansSuite = 'cls',
  Depose = 'dep',
  Desiste = 'des',
  EnConstruction = 'eco',
  Indetermine = 'ind',
  Initie = 'ini',
  EnInstruction = 'ins',
  Rejete = 'rej',
  Termine = 'ter',
  FinPoliceMines = 'fpm'
}

enum TitreEtapesTravauxTypes {
  DemandeAutorisationOuverture = 'wfa',
  DeclarationOuverture = 'wfo',
  DeclarationArret = 'wfd',
  DepotDemande = 'wdd',
  DemandeComplements = 'wdc',
  ReceptionComplements = 'wrc',
  Recevabilite = 'wre',
  AvisReception = 'war',
  SaisineAutoriteEnvironmentale = 'wse',
  AvisAutoriteEnvironmentale = 'wae',
  SaisineServiceEtat = 'wss',
  AvisServiceAdminLocal = 'wal',
  AvisDDTM = 'wad',
  AvisAutoriteMilitaire = 'wam',
  AvisARS = 'was',
  AvisDRAC = 'wac',
  AvisPrefetMaritime = 'wap',
  AvisAutresInstances = 'wai',
  ArretePrefectoralSursis = 'wps',
  MemoireReponseExploitant = 'wmm',
  OuvertureEnquetePublique = 'woe',
  ClotureEnquetePublique = 'wce',
  RapportDREAL = 'wrd',
  AvisRapportDirecteurREAL = 'wrl',
  TransPrescriptionsDemandeur = 'wtp',
  AvisCODERST = 'wat',
  AvisPrescriptionsDemandeur = 'wau',
  PubliDecisionRecueilActesAdmin = 'wpa',
  DonneActeDeclaration = 'wda',
  ArretePrefectDonneActe1 = 'wpp',
  ArretePrefectDonneActe2 = 'wpo',
  ArretePrescriptionComplementaire = 'wpc',
  ArreteOuvertureTravauxMiniers = 'wao',
  MemoireFinTravaux = 'wmt',
  Recolement = 'wrt',
  Abandon = 'wab',
  DecisionAdmin = 'wdm',
  PorterAConnaissance = 'wpb'
}

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
type ICouleur = 'error' | 'info' | 'neutral' | 'success' | 'warning'

interface IActiviteStatut {
  id: string
  nom: string
  couleur: ICouleur
}

interface IContenuId {
  sectionId: string
  elementId: string
}

type IContenuValeur =
  | string
  | number
  | string[]
  | boolean
  | IContenuElement[]
  | { file: FileUpload }

interface IContenuElement {
  [elementId: string]: IContenuValeur
}

interface IDecisionAnnexeContenuElement extends IContenuElement {
  date: string
  statutId: string
  [elementId: string]: IContenuValeur
}

interface IDecisionAnnexeContenu {
  [sectionId: string]: IDecisionAnnexeContenuElement
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
  | 'multiple'
  | 'file'

interface ISectionElement {
  id: string
  nom: string
  type: ISectionElementType
  description?: string | null
  dateDebut?: string | null
  dateFin?: string | null
  periodesIds?: number[] | null
  valeurs?: { id: string; nom: string }[] | null
  valeursMetasNom?: IValeurMetasNom
  referenceUniteRatio?: number
  optionnel?: boolean
  elements?: ISectionElement[]
}

interface IActiviteTypeDocumentType {
  activiteTypeId: string
  documentTypeId: string
  optionnel: boolean
}

interface IActiviteTypePays {
  activiteTypeId: string
  paysId: string
}

interface IActiviteType {
  id: string
  nom: string
  description?: string
  ordre: number
  frequenceId: string
  dateDebut: string
  delaiMois: number
  titresTypes: ITitreType[]
  documentsTypes: IDocumentType[]
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
  emailsModification?: boolean
  emailsLecture?: boolean
  modification?: boolean | null
  activitesTypesEmails?: (IActiviteType & { email: string })[]
}

interface IAnnee extends IPeriode {}

type IAreaType = 'communes' | 'forets' | 'sdomZones'

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
  couleur: ICouleur
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
  demarchesCreation?: boolean | null
  travaux?: boolean
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

export const DOCUMENTS_REPERTOIRES = [
  'demarches',
  'activites',
  'entreprises',
  'tmp'
] as const
type IDocumentRepertoire = typeof DOCUMENTS_REPERTOIRES[number]

interface IDocumentType {
  id: string
  nom?: string
  optionnel: boolean
  description?: string | null
  descriptionSpecifique?: string | null
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
  titresTypes?: ITitreType[]
  amodiataireTitres?: ITitre[] | null
  modification?: boolean | null
  archive?: boolean | null
}

interface ITitreEntreprise extends IEntreprise {
  operateur?: boolean
}

interface IEntrepriseTitreType {
  entrepriseId: string
  titreTypeId: string
  titresCreation: boolean
}

interface IEtapeStatut {
  id: string
  nom: string
  description?: string
  couleur: ICouleur
}

interface IEtapeTypeDocumentType {
  etapeTypeId: string
  documentTypeId: string
  optionnel?: boolean
}

interface IEtapeTypeJustificatifType extends IEtapeTypeDocumentType {}

interface ITitreTypeDemarcheTypeEtapeTypeDocumentType
  extends IEtapeTypeDocumentType {
  titreTypeId: string
  demarcheTypeId: string
}

interface ITitreTypeDemarcheTypeEtapeTypeJustificatifType
  extends ITitreTypeDemarcheTypeEtapeTypeDocumentType {}

interface IEtapeType {
  id: string
  nom: string
  ordre: number
  description?: string
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
  documentsTypes?: IDocumentType[]
  justificatifsTypes?: IDocumentType[]
  publicLecture?: boolean | null
  entreprisesLecture?: boolean | null
}

interface IForet extends IArea {}
interface ISDOMZone extends IArea {}

export enum SDOMZoneId {
  Zone0 = '0',
  Zone0Potentielle = '0_potentielle',
  Zone1 = '1',
  Zone2 = '2'
}

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
  sdomZones: ISDOMZone[]
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
  couleur: ICouleur
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

interface IActiviteTypeTitreType {
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

interface IAdministrationActiviteTypeEmail {
  administrationId: string
  activiteTypeId: string
  email: string
}

interface ITitreStatut {
  id: string
  nom: string
  couleur: ICouleur
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
  slug?: string
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
  titresAdministrations?: IAdministration[] | null
  surfaceEtape?: ITitreEtape | null
  surface?: number | null
  communes?: ICommune[] | null
  forets?: IForet[] | null
  sdomZones?: ISDOMZone[] | null
  demarches?: ITitreDemarche[]
  activites?: ITitreActivite[] | null
  pays?: IPays[] | null
  modification?: boolean | null
  suppression?: boolean | null
  publicLecture?: boolean | null
  entreprisesLecture?: boolean | null
  travauxCreation?: boolean | null
  demarchesCreation?: boolean | null
  contenusTitreEtapesIds?: IContenusTitreEtapesIds | null
  propsTitreEtapesIds: IPropsTitreEtapesIds
  contenu?: IContenu | null
  doublonTitreId?: string | null
  confidentiel?: boolean | null
}

interface ITitreActivite {
  id: string
  slug?: string
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
  deposable?: boolean | null
}

interface ITitreAdministration {
  administrationId: string
  titreId: string
}

interface ITitreAdministrationGestionnaire extends ITitreAdministration {
  associee?: boolean | null
}

interface ITitreAdministrationLocale {
  administrationId: string
  titreEtapeId: string
  associee?: boolean | null
}

interface ITitreArea {
  areaId?: string
  titreEtapeId: string
  surface?: number | null
}

interface ITitreCommune extends ITitreArea {
  communeId: string
}

interface ITitreForet extends ITitreArea {
  foretId: string
}

interface ITitreSDOMZone extends ITitreArea {
  sdomZoneId: string
}

interface ITitreEtapeJustificatif {
  documentId: string
  titreEtapeId: string
}

interface ITitreDemarche {
  id: string
  description?: string
  slug?: string
  titreId: string
  titre?: ITitre | null
  typeId: string
  statutId?: string | null
  statut?: IDemarcheStatut | null
  type?: IDemarcheType | null
  ordre?: number | null
  titreType?: ITitreType | null
  phase?: ITitrePhase | null
  parents?: ITitreDemarche[] | null
  enfants?: ITitreDemarche[] | null
  publicLecture?: boolean | null
  entreprisesLecture?: boolean | null
  modification?: boolean | null
  suppression?: boolean | null
  etapesCreation?: boolean | null
  etapes?: ITitreEtape[]
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
  nomTemporaire?: string | null
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
  entrepriseId?: string | null
  entreprise?: IEntreprise | null
  etapesAssociees?: ITitreEtape[] | null
  suppression?: boolean | null
}
interface ITitreEtape {
  id: string
  slug?: string
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
  documentIds?: string[] | null
  documentsTypesSpecifiques?: IDocumentType[] | null
  justificatifsTypesSpecifiques?: IDocumentType[] | null
  sectionsSpecifiques?: ISection[] | null
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
  justificatifIds?: string[] | null
  communes?: ICommune[] | null
  forets?: IForet[] | null
  sdomZones?: ISDOMZone[] | null
  incertitudes?: ITitreIncertitudes | null
  pays?: IPays[] | null
  contenusTitreEtapesIds?: IContenusTitreEtapesIds | null
  heritageProps?: IHeritageProps | null
  heritageContenu?: IHeritageContenu | null
  deposable?: boolean | null
  decisionsAnnexesSections?: ISection[] | null
  decisionsAnnexesContenu?: IDecisionAnnexeContenu | null
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
  slug?: string
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
  slug?: string
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
  titresTypesTitresStatuts?: ITitreTypeTitreStatut[] | null
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
  etapeType?: IEtapeType
  documentsTypes?: IDocumentType[] | null
  justificatifsTypes?: IDocumentType[] | null
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
  utilisateursCreation?: boolean | null
  newsletter?: boolean | null
  refreshToken?: string | null
}

interface IUtilisateurTitre {
  utilisateurId: string
  titreId: string
  utilisateur?: IUtilisateur | null
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type IUtilisateurCreation = PartialBy<Omit<IUtilisateur, 'id'>, 'permissionId'>

interface IToken {
  user?: ITokenUser
  res?: any
}

interface ITokenUser {
  id?: string
  email?: string
  iat?: number
}

type IFormat = 'xlsx' | 'csv' | 'ods' | 'geojson' | 'json' | 'pdf' | 'zip'

interface IDefinition {
  id: string
  nom: string
  ordre: number
  slug?: string
  table?: string
  description?: string | null
  couleur?: string
  elements?: IDefinition[]
}

interface ITitreDemande {
  nom: string
  typeId: string
  domaineId: string
  entrepriseId: string
  references?: ITitreReference[]
}
interface IJournaux {
  id: string
  utilisateurId: string
  date: string
  elementId: string
  titreId: string
  operation: 'create' | 'update' | 'delete'
  differences: any
}

export {
  TitreEtapesTravauxTypes,
  DemarchesStatutsTypes,
  Index,
  IFields,
  IFormat,
  IActiviteStatut,
  IActiviteType,
  IActiviteTypeDocumentType,
  ISection,
  ISectionElement,
  ISectionElementType,
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
  IEntrepriseTitreType,
  IEtapeStatut,
  IEtapeType,
  IForet,
  ISDOMZone,
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
  IActiviteTypeTitreType,
  IEtapeTypeEtapeStatut,
  IEtapeTypeDocumentType,
  IEtapeTypeJustificatifType,
  IAdministrationTitreType,
  IAdministrationTitreTypeTitreStatut,
  IAdministrationTitreTypeEtapeType,
  IAdministrationActiviteType,
  IAdministrationActiviteTypeEmail,
  ITitreStatut,
  ISubstance,
  ISubstanceLegale,
  ISubstanceLegaleCode,
  ISubstanceFiscale,
  ITitreSubstance,
  ITitre,
  ITitreActivite,
  ITitreAdministration,
  ITitreAdministrationGestionnaire,
  ITitreAdministrationLocale,
  ITitreCommune,
  ITitreForet,
  ITitreSDOMZone,
  ITitreArea,
  ITitreDemarche,
  IDocument,
  ITitreEtape,
  ITitreEtapeJustificatif,
  ITitreEtapeFiltre,
  ITitreIncertitudes,
  ITitrePhase,
  ITitrePoint,
  ITitrePointReference,
  ITitreReference,
  ITitreType,
  ITitreTypeType,
  ITitreTypeDemarcheTypeEtapeType,
  ITitreTypeDemarcheTypeEtapeTypeDocumentType,
  ITitreTypeDemarcheTypeEtapeTypeJustificatifType,
  ITitreEntreprise,
  ITrimestre,
  IUnite,
  IUser,
  IUtilisateur,
  IUtilisateurTitre,
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
  ICacheId,
  IActiviteTypePays,
  ITitreDemande,
  IJournaux,
  IDecisionAnnexeContenu
}
