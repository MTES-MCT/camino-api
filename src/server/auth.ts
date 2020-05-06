import * as express from 'express'
import * as basicAuth from 'basic-auth'
import * as bcrypt from 'bcryptjs'

import { debug } from '../config/index'

import { emailCheck } from '../api/resolvers/permissions/utilisateur'

import { userByEmailGet } from '../database/queries/utilisateurs'

interface IAuthRequest extends express.Request {
  user?: {
    [id: string]: string
  }
}

const userCredentialsCheck = async (email: string, motDePasse: string) => {
  email = email.toLowerCase()
  if (!emailCheck(email)) {
    throw new Error('adresse email invalide')
  }

  let user

  try {
    user = await userByEmailGet(email, {})

    if (!user) return null
  } catch (e) {
    const err = new Error(`Erreur technique : ${e.message}`)

    throw err
  }

  const valid = bcrypt.compareSync(motDePasse, user.motDePasse!)

  return valid ? user : null
}

const auth = async (
  req: IAuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    if (req.headers.authorization) {
      const credentials = basicAuth.parse(req.headers.authorization)
      if (credentials) {
        const user = await userCredentialsCheck(
          credentials.name,
          credentials.pass
        )

        if (!user) {
          res.status(401)
          res.send('Identifiants incorrects')

          return
        }

        req.user = { id: user.id }
      }
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    next(e)

    return
  }

  next()
}

export { auth }
