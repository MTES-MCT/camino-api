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

import chalk from 'chalk'
import * as compression from 'compression'
import * as cors from 'cors'
import * as express from 'express'
import * as expressGraphql from 'express-graphql'
import * as expressJwt from 'express-jwt'
import * as http from 'http'
import * as path from 'path'

import './database/index'

import rootValue from './api/resolvers'
import { documentNameGet } from './api/resolvers/documents'
import schema from './api/schemas'
import { port, url } from './config/index'

import * as Sentry from '@sentry/node'

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
interface IAuthRequest extends express.Request {
  user?: {
    [id: string]: string
  }
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

app.get('/documents/:titreDocumentId', async (req: IAuthRequest, res, next) => {
  try {
    const userId = req.user && req.user.id
    const { titreDocumentId } = req.params
    const documentName = await documentNameGet(userId, titreDocumentId)

    const options = {
      dotfiles: 'deny',
      headers: {
        'x-sent': true,
        'x-timestamp': Date.now()
      },
      root: path.join(__dirname, '../files')
    }

    return res.sendFile(documentName, options, err => {
      if (err) {
        res.status(404).send('fichier introuvable')
      }
    })
  } catch (error) {
    return res.status(403).send(error)
  }
})

interface IAuthRequestHttp extends http.IncomingMessage {
  user?: {
    [id: string]: string
  }
}

app.use(
  '/',
  expressGraphql((req: IAuthRequestHttp, res, graphQLParams) => ({
    context: {
      user: req.user
    },
    customFormatErrorFn: err => ({
      locations: err.locations,
      message: err.message,
      path: err.path,
      stack: err.stack ? err.stack.split('\n') : []
    }),
    graphiql: true,
    pretty: true,
    rootValue,
    schema
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
