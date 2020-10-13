import * as express from 'express'
import * as expressJwt from 'express-jwt'

const authJwt = expressJwt({
  credentialsRequired: false,
  getToken: (req: express.Request) => {
    if (!req.headers.authorization) return null

    const [type, token] = req.headers.authorization.split(' ')

    return type === 'Bearer' && token !== 'null' ? token : null
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
const authJwtError = (
  err: Error,
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: express.NextFunction
) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...')
  }
}

export { authJwt, authJwtError }
