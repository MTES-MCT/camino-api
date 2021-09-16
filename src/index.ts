/**
 * Camino API, le cadastre minier numérique ouvert
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import './init'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import * as Sentry from '@sentry/node'

import { port, url } from './config/index'
import { rest } from './server/rest'
import { graphql } from './server/graphql'
import { authJwt, authJwtError } from './server/auth-jwt'
import { authBasic } from './server/auth-basic'
import upload from './server/upload'
import { databaseInit } from './database/init'

import { consoleOverride, appLogger } from './config/logger'

consoleOverride(appLogger)
databaseInit().then(() => {
  const app = express()

  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.ENV === 'prod' ? 'production' : process.env.ENV
    })
    app.use(Sentry.Handlers.requestHandler())
  }

  app.use(
    cors({ credentials: true, exposedHeaders: ['Content-disposition'] }),
    compression(),
    authJwt,
    authJwtError,
    authBasic
  )
  app.use(rest)

  app.use('/uploads', upload)

  app.use('/', graphql)

  if (process.env.SENTRY_DSN) {
    // test sentry
    // app.get('/', (req, res) => {
    //   console.info('broke')
    //   throw new Error('Broke!')
    // })
    app.use(Sentry.Handlers.errorHandler())
  }

  app.listen(port, () => {
    console.info('')
    console.info('URL:', url)
    console.info('ENV:', process.env.ENV)
    console.info('NODE_ENV:', process.env.NODE_ENV)

    if (process.env.NODE_DEBUG === 'true') {
      console.warn('NODE_DEBUG:', process.env.NODE_DEBUG)
    }
    console.info('')
  })
})
