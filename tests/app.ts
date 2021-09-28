import express from 'express'

import { graphql } from '../src/server/graphql'
import { authJwt } from '../src/server/auth-jwt'
import { restUpload, uploadAllowedMiddleware } from '../src/server/upload'

const app = express()

app.use(authJwt)

app.use('/televersement', uploadAllowedMiddleware, restUpload())
app.use('/', graphql)

export { app }
