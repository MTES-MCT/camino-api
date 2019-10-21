import * as express from 'express'
import * as expressJwt from 'express-jwt'

const middlewareJwt = expressJwt({
  credentialsRequired: false,
  getToken: (req: express.Request) => {
    if (!req.headers.authorization) return null

    const [type, token] = req.headers.authorization.split(' ')

    return type === 'Bearer' && token !== 'null' ? token : null
  },
  secret: process.env.JWT_SECRET || 'jwtSecret should be declared in .env'
})

export default middlewareJwt
