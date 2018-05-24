require('dotenv').config()
require('./postgres')
const chalk = require('chalk')
const express = require('express')
var graphqlHTTP = require('express-graphql')
const { port, host, url } = require('./conf')
const schema = require('./graphql/schemas')
const resolvers = require('./graphql/resolvers')

const app = express()
app.use(
  '/',
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
    pretty: true
  })
)

app.listen(port, host, () => {
  console.log(chalk.bgWhiteBright.black.bold('Server:' + url))
})
