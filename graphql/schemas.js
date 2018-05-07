const { buildSchema } = require('graphql')

// The GraphQL schema in string form
const schemas = buildSchema(`
  type Query {
    titres: [Title]
    titre(name: String!): Title
  }

  type Title {
    name: String
    author: String
  }

  type Mutation {
    setTitle(name: String!): String
  }
`)

module.exports = schemas
