/**
 * Camino API, le cadastre minier numérique ouvert
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

require('dotenv').config()
require('./database/index')
const chalk = require('chalk')
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const graphqlHTTP = require('express-graphql')
const expressJwt = require('express-jwt')
const Sentry = require('@sentry/node')

const { env, port, url, jwtSecret } = require('./config/index')
const schema = require('./api/schemas')
const rootValue = require('./api/resolvers')

Sentry.init({
  dsn: process.env.SENTRY_DSN
})

const app = express()

app.use(Sentry.Handlers.requestHandler())

app.use(cors({ credentials: true }))

app.use(compression())

app.use(
  expressJwt({
    credentialsRequired: false,
    secret: jwtSecret || 'jwtSecret should be declared in .env'
  })
  // (err, req, res, next) => {
  //   if (err.code === 'invalid_token') return next()
  //   return next()
  // }
)

// app.get('/', (req, res) => {
//   console.log('broke')
//   throw new Error('Broke!')
// })

app.use(
  '/',
  graphqlHTTP((req, res, graphQLParams) => ({
    schema,
    rootValue,
    graphiql: true,
    pretty: true,
    formatError: err => ({
      message: err.message,
      locations: err.locations,
      stack: err.stack ? err.stack.split('\n') : [],
      path: err.path
    }),
    context: {
      user: req.user
    }
  }))
)

app.use(Sentry.Handlers.errorHandler())

app.listen(port, () => {
  console.log(' ')
  console.log(chalk.bgWhiteBright.black.bold('> Url: ' + url + ' '))
  console.log(chalk.bgWhiteBright.black.bold('> Env: ' + env + ' '))
  console.log(' ')
})
