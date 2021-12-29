import express from 'express'
import expressJwt from 'express-jwt'
import jwt from 'jsonwebtoken'
import { userByRefreshTokenGet } from '../database/queries/utilisateurs'
import {
  accessTokenGet,
  cookieSet,
  userTokensDelete
} from '../api/graphql/resolvers/utilisateurs'

const authJwt = expressJwt({
  credentialsRequired: false,
  getToken: (req: express.Request) => {
    return req.cookies?.accessToken || null
  },
  secret: process.env.JWT_SECRET || 'jwtSecret should be declared in .env',
  algorithms: ['HS256']
})

interface Error {
  status?: number
  name?: string
  message?: string
}

// attrape les erreurs d'expiration du token
const authJwtError = async (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err.name === 'UnauthorizedError') {
    const refreshToken = req.cookies?.refreshToken

    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH!)

    const user = await userByRefreshTokenGet(refreshToken)

    if (!user || !refreshToken) {
      userTokensDelete(res)
      res.status(401).send('invalid token...')

      return
    }

    cookieSet('accessToken', accessTokenGet(user), res)
    // il faut mettre l’utilisateur dans la requête car suite à l’erreur, authJwt ne l’a pas fait
    req.user = user
    next()
  }
}

export { authJwt, authJwtError }
