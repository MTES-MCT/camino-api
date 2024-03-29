import express from 'express'

import { graphql } from '../src/server/graphql'
import { authJwt } from '../src/server/auth-jwt'
import { restUpload, uploadAllowedMiddleware } from '../src/server/upload'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(authJwt)

app.use('/televersement', uploadAllowedMiddleware, restUpload())
app.use('/', graphql)

export { app }
