const fs = require('fs')
const path = require('path')
const { gql } = require('apollo-server')

const titles = fs.readFileSync(
  path.join(__dirname, 'schemas/titles.gql'),
  'utf8'
)

const substances = fs.readFileSync(
  path.join(__dirname, 'schemas/substances.gql'),
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

    substances: [Substance]
  }

  type Mutation {
    titreAjouter(titre: InputTitre!): Titre

    titreSupprimer(id: ID!): Titre

    titreModifier(titre: InputTitre!): Titre
  }

  ${titles}

  ${substances}
`

module.exports = typeDefs
