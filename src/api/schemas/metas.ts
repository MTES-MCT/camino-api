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

"Le type de titre minier"
type Type {
  "L'id composée de trois lettres"
  id: TypeId!

  "Le nom du type en français"
  nom: String!

  "Les types de démarches applicables à ce type de titre"
  demarchesTypes: [DemarcheType]
}

"Le domaine minier"
type Domaine {
  "L'id composée d'une seule lettre"
  id: DomaineId!

  "Le nom du domaine en français"
  nom: String!
}

"Le domaine minier"
input InputDomaineId {
  "L'id composée d'une seule lettre"
  id: DomaineId!

  "Le nom du domaine en français"
  nom: String
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

  "Les types de statuts applicables à ce type de démarche"
  demarchesStatuts: [DemarcheStatut]

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

- __apx__: Autorisation de prospections préalables (M, H, C)
- __arc__: Autorisation de recherches (C)
- __arg__: Autorisation de recherches (G)
- __arm__: Autorisation de recherches (M)
- __axm__: Autorisation d'exploitation (M)
- __cxx__: Concession (M, H, G, S, C)
- __prh__: Permis exclusif de recherches (H)
- __prx__: Permis exclusif de recherches (M, G, S, C)
- __pxc__: Permis exclusif de carrières (C)
- __pxg__: Permis d'exploitation (G)
- __pxh__: Permis d'exploitation (H)
- __pxm__: Permis d'exploitation (M)
"""
enum TypeId {
  apx
  arc
  arg
  arm
  axm
  cxx
  prh
  prx
  pxc
  pxg
  pxh
  pxm
  pxx
}

"""
L'id du domaine minier

- __c__: Carrières
- __f__: Combustibles fossiles
- __g__: Géothermie
- __h__: Substances énergétiques
- __m__: Minéraux et métaux
- __r__: Eléments radioactifs
- __s__: Stockage
- __w__: Granulats marins
"""
enum DomaineId {
  c
  f
  g
  h
  m
  r
  s
  w
}

"""
L'id du statut d'un titre minier

- __dmc__: Demande classée
- __dmi__: Demande initiale
- __ech__: Échu
- __ind__: Indéterminé
- __mod__: Modification en instance
- __val__: Valide
"""
enum StatutId {
  dmc
  dmi
  ech
  ind
  mod
  val
}

"""
L'id de l'emprise géographique d'un titre minier

- __ter__: À terre
- __mer__: En mer
"""
enum EmpriseId {
  ter
  mer
}

"""
L'id du statut d'une démarche de titre minier

- __acc__: Acceptée
- __cls__: Classée sans suite
- __dep__: Déposée
- __eco__: En construction
- __ind__: Indeterminé
- __ini__: Initiée
- __ins__: En instruction
- __rej__: Rejetée
- __ret__: Retirée
- __ter__: Terminée
"""
enum DemarcheStatutId {
  acc
  cls
  dep
  eco
  ind
  ini
  ins
  rej
  ret
  ter
}

"""
L'id du statut d'une phase de titre minier

- __val__: Valide
- __ech__: Échu
"""
enum PhaseStatutId {
  val
  ech
}

"""
L'id du statut d'une étape de démarche de titre minier

- __acc__: Acceptation
- __def__: Défavorable
- __dre__: Défavorable avec réserves
- __fav__: Favorable
- __fre__: Favorable avec réserves
- __nul__: Non applicable
- __rej__: Rejet
- __nfa__: Non fait
- __fai__: Fait
"""
enum EtapeStatutId {
  acc
  def
  dre
  fav
  fre
  nul
  rej
  nfa
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

"Le type de titre minier"
input InputType {
  id: TypeId!
}

"Le domaine minier"
input InputDomaine {
  id: DomaineId!
}
`
