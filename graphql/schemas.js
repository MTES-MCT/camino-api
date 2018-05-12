const { gql } = require('apollo-server')
const { Statut, Travaux } = require('./types')

const typeDefs = gql`
  type Query {
    "Liste de titres"
    titres(type: [Type], domaine: [Domaine]): [Titre]

    "Un titre"
    titre(id: String!): Titre
  }

  "Titre minier"
  type Titre {
    """
    L'__id__ du titre est constituée de la concaténation:
    - du type en 3 lettres.
    - du nom du titre en minuscule, sans caractères spéciaux, avec des tirets au lieu des espaces.

    Exemples: _con-saint-elie_ ou _per-pedral_.
    """
    id: ID!
    nom: String!
    type: Type!
    domaine: Domaine!
    statut: Statut!
    travaux: Travaux!
  }

  """
  - __aex__: Autorisation d'exploitation
  - __con__: Concession
  - __per__: Permis exclusif de recherches
  """
  enum Type {
    aex
    con
    per
  }

  """
  - __m__: Minéraux et métaux
  - __h__: Substances énergétiques
  - __s__: Stockage
  - __g__: Géothermie
  """
  enum Domaine {
    m
    h
    s
    g
  }

  """
  - __ins__: En instruction
  - __val__: Valide
  - __ech__: Échu
  """
  scalar Statut

  enum Travaux {
    val
    ech
    ins
  }

  type Mutation {
    titreAjouter(titre: TitreInput!): Titre

    titreSupprimer(id: ID!): Titre

    titreModifier(titre: TitreInput!): Titre
  }

  input TitreInput {
    id: ID!
    nom: String!
    type: Type!
    domaine: Domaine!
    statut: Statut!
    travaux: Travaux!
  }

  input StatutInput {
    id: ID!
    nom: String!
  }

  input TravauxInput {
    id: ID!
    nom: String!
  }
`

module.exports = typeDefs
