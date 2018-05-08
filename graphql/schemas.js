const { buildSchema } = require('graphql')

// The GraphQL schema in string form
const schemas = buildSchema(`
  type Query {

    "Propriétés d'une liste de titres"
    titres: [Titre]

    "Propriétés d'un titre"
    titre(nom: String!): Titre
  }

  "Titre minier"
  type Titre {

    "Nom du titre"
    nom: String
    
    "Auteur du titre"
    auteur: String

    "ID du titre"
    _id: ID
  }

  type Mutation {
    titre_ajouter(nom: String!): Titre
  }
`)

module.exports = schemas
