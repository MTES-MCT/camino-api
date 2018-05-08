const { ApolloServer } = require('apollo-server')

const { port, host, virtualUrl } = require('./config')
const databaseConnect = require('./database/connect')
const typeDefs = require('./graphql/schemas')
const resolvers = require('./graphql/resolvers')

databaseConnect()

const server = new ApolloServer({ typeDefs, resolvers })

server.listen({ port, host }).then(({ url }) => {
  console.log(`🚀 Server ready at ${virtualUrl || url}`)
})
