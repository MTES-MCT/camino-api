import * as express from 'express'
import { graphql } from '../src/server/graphql'
import { authJwt } from '../src/server/auth-jwt'

const app = express()

app.use(authJwt)
app.use('/', graphql)

export { app }
