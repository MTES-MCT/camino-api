const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const PORT = 80
const HOST = '0.0.0.0'

mongoose.connect('mongodb://mongo:27017')

// Some fake data
const books = [
  {
    title: "Harry Pooter and the Sorcerer's stone",
    author: 'J.K. Rowling'
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton'
  }
]

// The GraphQL schema in string form
const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`

// The resolvers
const resolvers = {
  Query: { books: () => books }
}

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

// Initialize the app
const app = express()

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

// Start the server
app.listen(PORT, HOST, () => {
  console.log(
    `Go to https://${process.env.VIRTUAL_HOST}/graphiql to run queries!`
  )
})
