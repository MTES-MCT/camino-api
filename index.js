const express = require('express')
// const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')

const { HOST, PORT, PATH, URL } = require('./config')
const databaseConnect = require('./database/connect')
const schemas = require('./graphql/schemas')
const resolvers = require('./graphql/resolvers')

const app = express()

databaseConnect()

app.use(
  `/${PATH}`,
  graphqlHTTP({
    schema: schemas,
    rootValue: resolvers,
    graphiql: true
  })
)

app.listen(PORT, HOST, () => {
  console.log(`Go to ${URL} to run queries!`)
})
