require('dotenv').config()
require('./postgres')
const chalk = require('chalk')
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const graphqlHTTP = require('express-graphql')
const jwt = require('express-jwt')
const { env, port, url, jwtSecret } = require('./conf')
const schema = require('./graphql/schemas')
const rootValue = require('./graphql/resolvers')
const token = require('./auth/token')
console.log(chalk.bgWhiteBright.black.bold('> Token: Bearer ' + token + ' '))

const app = express()

app.use(cors())

app.use(
  '/',
  jwt({
    secret: jwtSecret || 'jwtSecret should be declared in .env',
    credentialsRequired: false
  }),
  graphqlHTTP((req, res, graphQLParams) => ({
    schema,
    rootValue,
    graphiql: true,
    pretty: true,
    // formatError: err => ({
    //   message: err.message,
    //   locations: err.locations,
    //   stack: err.stack ? err.stack.split('\n') : [],
    //   path: err.path
    // }),
    context: {
      user: req.user
    }
  }))
)

app.use(compression())

app.listen(port, () => {
  console.log(' ')
  console.log(chalk.bgWhiteBright.black.bold('> Url: ' + url + ' '))
  console.log(chalk.bgWhiteBright.black.bold('> Env: ' + env + ' '))
  console.log(' ')
  // draft({ id: 'c-cxx-astrolabe' }).then(r => console.log(r))
})
