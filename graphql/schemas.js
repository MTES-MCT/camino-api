const { gql } = require('apollo-server')

const typeDefs = gql`
  "Titre minier"
  type Titre {
    "Nom du titre"
    nom: String

    "Auteur du titre"
    auteur: String

    "ID du titre"
    _id: ID
  }

  type Query {
    "Propriétés d'une liste de titres"
    titres: [Titre]

    "Propriétés d'un titre"
    titre(nom: String!): Titre
  }

  type Mutation {
    titre_ajouter(id: ID!): Titre
  }
`

module.exports = typeDefs
