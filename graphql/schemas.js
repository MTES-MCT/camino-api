const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    "Une liste de titres"
    titres(type: [Type], domaine: [Domaine]): [Titre]

    "Un titre"
    titre(id: String!): Titre
  }

  "Titre minier"
  type Titre {
    id: ID!
    nom: String!
    type: Type!
    domaine: Domaine!
  }

  enum Type {
    aex
    con
    per
  }

  enum Domaine {
    m
    h
    s
    g
  }

  type Statut {
    id: ID!
    nom: String!
  }

  type Travaux {
    id: ID!
    nom: String!
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
