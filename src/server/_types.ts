/* eslint-disable no-undef */
import * as express from 'express'

// bug de typage de express-jwt
// https://github.com/auth0/express-jwt/issues/215
interface IAuthRequest extends express.Request {
  user?: {
    [id: string]: string
  }
}

export { IAuthRequest }
