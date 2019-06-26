export default `
"""
Meta-informations sur les titres miniers (types, domaines, statuts)
"""
type Metas {
  "Types de titres miniers (ex: permis exclusif de recherches, autorisation d'exploitation, etc.)"
  types: [Type]

  "Domaines miniers (ex: substances énergétiques, minéraux et métaux, etc.)"
  domaines: [Domaine]

  "Statuts des titres miniers (ex: valide, demande initiale, etc.)"
  statuts: [Statut]

  "Systèmes géodésiques utilisés dans Camino"
  geoSystemes: [GeoSysteme]

  "Devises utilisées dans Camino"
  devises: [Devise]

  "Unités de volume utilisées dans Camino"
  volumeUnites: [VolumeUnite]

  "Les emprises territoriales"
  emprises: [Emprise]
}

"Le domaine minier"
type Domaine {
  "L'id composée d'une seule lettre"
  id: DomaineId!

  "Le nom du domaine en français"
  nom: String!

  types: [Type]!
}

"Le type de titre minier"
type Type {
  "L'id composée de trois lettres"
  id: TypeId!

  "Le nom du type en français"
  nom: String!

  "Les types de démarches applicables à ce type de titre"
  demarchesTypes: [DemarcheType]
}

"Le statut d'un titre minier"
type Statut {
  "L'id composée de trois lettres"
  id: StatutId!

  "Le nom du statut en français"
  nom: String!

  "La couleur associé au statut"
  couleur: Couleur!
}

"Le type de démarche applicable à un titre minier"
type DemarcheType {
  "L'id composée de trois lettres"
  id: ID!

  "Le nom en français"
  nom: String!

  "L'ordre de ce type de démarche"
  ordre: Int

  "Si la démarche contient une information de duréee"
  duree: Boolean

  "Si la démarche contient des informations géographiques"
  points: Boolean

  "Si la démarche contient des informations de substances"
  substances: Boolean

  "Si la démarche contient des titulaires"
  titulaires: Boolean

  "Si la démarche est renouvelable"
  renouvelable: Boolean

  exception: Boolean

  "Les types d'étapes applicables à ce type de démarche"
  etapesTypes: [EtapeType]
}

"Le statut d'une démarche applicable à un titre minier"
type DemarcheStatut {
  "L'id composée de trois lettres"
  id: DemarcheStatutId!

  "Le nom en français"
  nom: String!

  couleur: Couleur!
}

"Le statut d'une phase de titre minier"
type PhaseStatut {
  "Le statut d'une phase de titre minier est composé de trois lettres"
  id: PhaseStatutId!

  "Le nom d'une phase de titre minier en français"
  nom: String!

  couleur: Couleur!
}

"Le type d'étape d'une démarche de titre minier"
type EtapeType {
  "L'id composée de trois lettres"
  id: ID!

  "Le nom en français"
  nom: String!

  acceptationAuto: Boolean
  ordre: Int!

  "Type de titre pour laquelle cette étape existe"
  typeId: TypeId

  etapesStatuts: [EtapeStatut]
}

type DemarcheType_etapeType {
  typeId: ID!

  demarcheTypeId: ID!

  etapeTypeId: ID!

  ordre: Int!
}

"Le statut d'une étape de démarche de titre minier"
type EtapeStatut {
  "L'id du statut d'étape est composé de trois lettres"
  id: EtapeStatutId!

  "Le nom du domaine en français"
  nom: String!

  couleur: Couleur!
}

"Unité de volume"
type VolumeUnite {
  id: ID!

  nom: String!
}

"Devise"
type Devise {
  id: ID!

  nom: String!
}

"Système géodésique"
type GeoSysteme {
  id: ID!

  nom: String!

  zone: String

  unite: String
}

"L'emprise géographique d'un titre minier"
type Emprise {
  "L'id composée de trois lettres"
  id: EmpriseId!

  "Le nom en français"
  nom: String!
}

"""
L'id du type de titre minier
"""
enum TypeId {
  "Autorisation de prospections préalables (M, H, C)"
  apx
  "Autorisation de recherches (C)"
  arc
  "Autorisation de recherches (G)"
  arg
  "Autorisation de recherches (M)"
  arm
  "Autorisation d'exploitation (M)"
  axm
  "Concession (M, H, G, S, C)"
  cxx
  "Permis exclusif de recherches (H)"
  prh
  "Permis exclusif de recherches (M, G, S, C)"
  prx
  "Permis exclusif de carrières (C)"
  pxc
  "Permis d'exploitation (G)"
  pxg
  "Permis d'exploitation (H)"
  pxh
  "Permis d'exploitation (M)"
  pxm
  "Permis d'exploitation (W, R)"
  pxx
}

"""
L'id du domaine minier
"""
enum DomaineId {
  "Carrières"
  c
  "Combustibles fossiles"
  f
  "Géothermie"
  g
  "Substances énergétiques"
  h
  "Minéraux et métaux"
  m
  "Eléments radioactifs"
  r
  "Stockage"
  s
  "Granulats marins"
  w
}

"""
L'id du statut d'un titre minier
"""
enum StatutId {
  "Demande classée"
  dmc
  "Demande initiale"
  dmi
  "Échu"
  ech
  "Indéterminé"
  ind
  "Modification en instance"
  mod
  "Valide"
  val
}

"""
L'id de l'emprise géographique d'un titre minier
"""
enum EmpriseId {
  "À terre"
  ter
  "En mer"
  mer
}

"""
L'id du statut d'une démarche de titre minier
"""
enum DemarcheStatutId {
  "Acceptée"
  acc
  "Classée sans suite"
  cls
  "Déposée"
  dep
  "En construction"
  eco
  "Indeterminé"
  ind
  "Initiée"
  ini
  "En instruction"
  ins
  "Rejetée"
  rej
  "Retirée"
  ret
  "Terminée"
  ter
}

"""
L'id du statut d'une phase de titre minier 
"""
enum PhaseStatutId {
  "Valide"
  val
  "Échu"
  ech
}

"""
L'id du statut d'une étape de démarche de titre minier
"""
enum EtapeStatutId {
  "Acceptation"
  acc
  "Ajournée"
  ajo
  "Défavorable"
  def
  "Défavorable avec réserves"
  dre
  "Favorable"
  fav
  "Favorable avec réserves"
  fre
  "Non applicable"
  nul
  "Rejet"
  rej
  "Non fait"
  nfa
  "Fait"
  fai
}

"""
Une liste de couleurs génériques
"""
enum Couleur {
  error
  info
  neutral
  success
  warning
}
`
