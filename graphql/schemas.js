const { gql } = require('apollo-server')
const fileImport = require('../utils/file-import.js')

const titleSchema = fileImport(__dirname, 'schemas/title.gql')
const substanceSchema = fileImport(__dirname, 'schemas/substance.gql')

const typeDefs = gql`
  type Query {
    "Liste de titres"
    titres(
      typeId: [TypeId]
      domaineId: [DomaineId]
      statutId: [StatutId]
      travauxId: [TravauxId]
    ): [Titre]

    "Un titre"
    titre(id: String!): Titre

    substances: [Substance]
  }

  type Mutation {
    titreAjouter(titre: InputTitre!): Titre

    titreSupprimer(id: ID!): Titre

    titreModifier(titre: InputTitre!): Titre
  }

  ${titleSchema}

  ${substanceSchema}
`

module.exports = typeDefs
