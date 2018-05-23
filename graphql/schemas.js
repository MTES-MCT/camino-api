const { gql } = require('apollo-server')
const fileImport = require('./_file-import.js')

const titreSchema = fileImport(__dirname, 'schemas/titre.gql')
const substanceSchema = fileImport(__dirname, 'schemas/substance.gql')
const geojsonSchema = fileImport(__dirname, 'schemas/geojson.gql')

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

    substance(id: String!): Substance

    geojsons: [Geojson]

    geojson(id: String!): Geojson
  }

  type Mutation {
    titreAjouter(titre: InputTitre!): Titre

    titreSupprimer(id: ID!): Titre

    titreModifier(titre: InputTitre!): Titre
  }

  ${titreSchema}

  ${substanceSchema}

  ${geojsonSchema}
`

module.exports = typeDefs
