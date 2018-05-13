const fs = require('fs')
const path = require('path')
const { gql } = require('apollo-server')

const titles = fs.readFileSync(
  path.join(__dirname, 'schemas/titles.gql'),
  'utf8'
)

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
  }

  type Mutation {
    titreAjouter(titre: TitreInput!): Titre

    titreSupprimer(id: ID!): Titre

    titreModifier(titre: TitreInput!): Titre
  }

  ${titles}
`

module.exports = typeDefs
