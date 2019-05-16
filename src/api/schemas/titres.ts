export default `
"Titre minier"
type Titre {
  """
  L'__id__ composée de la concaténation:
  - du type en 3 lettres
  - du slug du nom du titre
  - de l'année d'octroi
  """
  id: ID!

  "Le nom du titre"
  nom: String!

  "Le type du titre"
  type: Type!

  "Le domaine minier auquel se rattache le titre"
  domaine: Domaine!

  "Les références métier du titre"
  references: [Reference]

  "Le statut du titre"
  statut: Statut!

  "Les substances concernées par le titre dans son dernier état de validité"
  substances: [TitreSubstance]

  "Les coordonnées des points du périmètre géographique du titre dans son dernier état de validité"
  points: [Point]

  "Le geojson du contour du périmètre géographique du titre dans son dernier état de validité"
  geojsonMultiPolygon: GeojsonMultiPolygon
  "Le geojson de la liste de points du périmètre géographique du titre dans son dernier état de validité"

  geojsonPoints: GeojsonPoints
  "Les titualires du titre dans son dernier état de validité"
  titulaires: [Entreprise]

  "Les amodiataires du titre dans son dernier état de validité"
  amodiataires: [Entreprise]

  "Les administrations en charge du titre dans son dernier état de validité"
  administrations: [Administration]

  "Les communes du titre dans son dernier état de validité"
  pays: [Pays]

  "Les démarches effectuées sur le titre"
  demarches: [Demarche]

  "La surface en Km² du titre dans son dernier état de validité"
  surface: Float

  "Le volume du titre dans son dernier état de validité"
  volume: Float

  "L'unité du volume du titre dans son dernier état de validité"
  volumeUnite: VolumeUnite

  "Le montant de l'engagement financier du titulaire"
  engagement: Float

  "La devise de l'engagement financier du titulaire"
  engagementDevise: Devise

  "Les activités sur un titre"
  activites: [TitreActivite]
}

"Références métier d'un titre minier"
type Reference {
  "Le type est une chaine de caractère qui défini le référentiel (par exemple: DEB, DGEC, etc."
  type: String

  "La référence du titre dans le référentiel"
  valeur: String!
}

"Démarches effectuées sur un titre minier"
type Demarche {
  """
  L'__id__ composée de la concaténation:
  - de l'id du titre
  - du type de la démarche
  """
  id: ID!

  "Le type de la démarche composé de trois lettres"
  type: DemarcheType!

  "L'ordre chronologique de la démarche"
  ordre: Int!

  "Le statut de la démarche"
  statut: DemarcheStatut!

  "La phase, si la démarche donne lieu à une phase"
  phase: Phase

  "Les étapes effectuées sur la démarche"
  etapes: [Etape]

  "Les démarches liées"
  enfants: [Demarche]

  "Les démarches liées"
  parents: [Demarche]
}

"Phase d'un titre minier"
type Phase {
  "Le statut d'une phase"
  statut: PhaseStatut!

  "La date de début d'une phase"
  dateDebut: Date

  "La date de fin d'une phase"
  dateFin: Date
}

"Étape d'une démarche effectuée sur un titre minier"
type Etape {
  """
  L'__id__ composée de la concaténation:
  - de l'id de la démarche
  - du type de l'étape
  """
  id: ID!

  "Le type de l'étape"
  type: EtapeType!

  "Le statut de l'étape"
  statut: EtapeStatut!

  "L'ordre chronologique de l'étape"
  ordre: Int!

  "La date de l'étape"
  date: Date!

  "La durée de la démarche"
  duree: Int

  "La date de début de la démarche"
  dateDebut: Date

  "La date de fin de la démarche"
  dateFin: Date

  "La surface en Km² du titre"
  surface: Float

  "Le volume du titre"
  volume: Float

  "L'unité de volume du titre"
  volumeUnite: VolumeUnite

  "Les visas de l'étape"
  visas: [String]

  "Le montant de l'engagement financier du titulaire"
  engagement: Float

  "La devise de l'engagement financier du titulaire"
  engagementDevise: Devise

  "L'emprise géographique du titre"
  emprises: [Emprise]

  "Les substances concernées par le titre"
  substances: [TitreSubstance]

  "Les coordonnées des points du périmètre géographique du titre"
  points: [Point]

  "Le geojson du contour du périmètre géographique du titre"
  geojsonMultiPolygon: GeojsonMultiPolygon

  "Le geojson de la liste de points du périmètre géographique du titre"
  geojsonPoints: GeojsonPoints

  "Les titualires du titre dans son dernier état de validité"
  titulaires: [Entreprise]

  "Les amodiataires du titre dans son dernier état de validité"
  amodiataires: [Entreprise]

  "Les administrations en charge du titre"
  administrations: [Administration]

  "Les documents relatifs à l'étape"
  documents: [Document]
 
  incertitudes: Incertitudes
}

type EtapeId {
  etapeId: ID!
}

type Incertitudes {
  date: Boolean
  dateDebut: Boolean
  dateFin: Boolean
  duree: Boolean
  surface: Boolean
  volume: Boolean
  engagement: Boolean
  points: Boolean
  substances: Boolean
  titulaires: Boolean
  amodiataires: Boolean
  administrations: Boolean
}

"Document attaché à une étape de démarche"
type Document {
  """
  L'__id__ composée de la concaténation:
  - de l'id de l'étape
  - du type du document
  """
  id: ID!

  "Le nom du document"
  nom: String!

  "Le type de document (arrêté, décret, etc.)"
  type: String

  "L'url du document"
  url: String

  "L'uri du document"
  uri: String

  "Le type de fichier"
  fichier: String

  "La référence au Journal Officiel"
  jorf: String

  "La référence Nor"
  nor: String
}

"Titre minier"
input InputTitre {
  """
  L'__id__ composée de la concaténation:
  - du type en 3 lettres
  - du slug du nom du titre
  - de l'année d'octroi
  """
  id: ID!

  nom: String!

  typeId: ID!

  domaineId: ID!

  references: [InputReference]
}

input InputReference {
  type: String!
  valeur: String!
}

input InputDemarche {
  id: ID!

  typeId: ID!

  titreId: ID!
}

input InputEtape {
  id: ID!

  typeId: ID!

  statutId: EtapeStatutId!

  titreDemarcheId: ID!

  date: Date!

  ordre: Int

  duree: Int

  dateDebut: Date

  dateFin: Date

  surface: Float

  volume: Float

  volumeUniteId: ID

  visas: [String]

  engagement: Float

  engagementDeviseId: ID

  emprisesIds: [ID!]

  substancesIds: [ID!]

  points: [InputPoint]

  titulairesIds: [ID!]

  amodiatairesIds: [ID!]

  administrationsIds: [ID!]
 
  incertitudes: InputIncertitudes
}

input InputEtapeId {
  etapeId: ID!
}

input InputDocument {
  id: ID!

  nom: String!

  type: String

  url: String

  uri: String

  fichier: String

  jorf: String

  nor: String
}

input InputIncertitudes {
  date: Boolean
  dateDebut: Boolean
  dateFin: Boolean
  duree: Boolean
  surface: Boolean
  volume: Boolean
  engagement: Boolean
  points: Boolean
  substances: Boolean
  titulaires: Boolean
  amodiataires: Boolean
  administrations: Boolean
}`
