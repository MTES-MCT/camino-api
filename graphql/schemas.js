const { gql } = require('apollo-server')

const typeDefs = gql`
  "Titre minier"
  type Titre {
    "ID du titre"
    id: ID!

    "Nom du titre"
    nom: String!

    "Type de titre"
    type: Type!

    statut: Statut!

    travaux: Travaux!
  }

  type Type {
    id: ID!
    nom: String!
    code: String!
  }

  type Statut {
    id: ID!
    nom: String!
  }

  type Travaux {
    id: ID!
    nom: String!
  }

  type Query {
    "Propriétés d'une liste de titres"
    titres: [Titre]

    "Propriétés d'un titre"
    titre(id: String!): Titre
  }

  type Mutation {
    titreAjouter(id: ID!, nom: String!): Titre

    titreModifier(id: ID!, nom: String!): Titre
  }
`

module.exports = typeDefs
