/**
 * Camino API, le cadastre minier numérique ouvert
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import 'dotenv/config'
import './database/index'
import chalk from 'chalk'
import * as express from 'express'
import * as cors from 'cors'
import * as compression from 'compression'
import * as expressGraphql from 'express-graphql'
import * as expressJwt from 'express-jwt'
import * as Sentry from '@sentry/node'

import { port, url } from './config/index'
import schema from './api/schemas'
import rootValue from './api/resolvers'

const app = express()

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN
    // integrations: [
    //   new Sentry.Integrations.RewriteFrames({
    //     root: global.__rootdir__
    //   })
    // ]
  })

  app.use(Sentry.Handlers.requestHandler())
}

app.use(cors({ credentials: true }))

app.use(compression())

// bug de typage de express-jwt
// https://github.com/auth0/express-jwt/issues/215
interface AuthRequest extends express.Request {
  user?: string
}

app.use(
  expressJwt({
    credentialsRequired: false,
    secret: process.env.JWT_SECRET || 'jwtSecret should be declared in .env'
  })
)

// test sentry
// app.get('/', (req, res) => {
//   console.log('broke')
//   throw new Error('Broke!')
// })

app.use(
  '/',
  expressGraphql((req: AuthRequest, res, graphQLParams) => ({
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

if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler())
}

app.listen(port, () => {
  console.log(' ')
  console.log(chalk.bgWhiteBright.black.bold('> Url: ' + url + ' '))
  console.log(chalk.bgWhiteBright.black.bold('> ENV: ' + process.env.ENV + ' '))
  console.log(
    chalk.bgWhiteBright.black.bold('> NODE_ENV: ' + process.env.NODE_ENV + ' ')
  )
  console.log(' ')
})
