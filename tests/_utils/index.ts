import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import request from 'supertest'

import { Index, IPermissionId, IUtilisateur } from '../../src/types'

import { app } from '../app'
import {
  utilisateurCreate,
  utilisateurGet
} from '../../src/database/queries/utilisateurs'
import { userSuper } from '../../src/database/user-super'

const queryImport = (nom: string) =>
  fs
    .readFileSync(path.join(__dirname, `../queries/${nom}.graphql`))
    // important pour transformer le buffer en string
    .toString()

const tokenCreate = (user: Partial<IUtilisateur>) =>
  jwt.sign(user, process.env.JWT_SECRET as string)

const graphQLCall = async (
  query: string,
  variables: Index<
    string | boolean | Index<string | boolean | Index<string>[] | any>
  >,
  permissionId?: IPermissionId,
  administrationId?: string
) => {
  const req = request(app).post('/').send({ query, variables })

  return cookiesSet(req, permissionId, administrationId)
}

const restUploadCall = async (permissionId?: IPermissionId) => {
  const req = request(app).post('/televersement')

  return cookiesSet(req, permissionId)
}

const cookiesSet = async (
  req: request.Test,
  permissionId?: IPermissionId,
  administrationId?: string
) => {
  let token
  if (permissionId) {
    token = await userTokenGenerate(permissionId, administrationId)
  }

  if (token) {
    req.cookies = `accessToken=${token}`
  }

  return req
}

const userTokenGenerate = async (
  permissionId: IPermissionId,
  administrationId?: string
) => {
  let id = 'super'

  if (permissionId !== 'super') {
    id = `${permissionId}-user`

    if (administrationId) {
      id += `-${administrationId}`
    }
  }

  const userInDb = await utilisateurGet(id, undefined, userSuper)

  if (!userInDb) {
    const administrations = []

    if (administrationId) {
      administrations.push({ id: administrationId })
    }

    await utilisateurCreate(
      {
        id,
        prenom: `prenom-${permissionId}`,
        nom: `nom-${permissionId}`,
        email: `${id}@camino.local`,
        motDePasse: 'mot-de-passe',
        permissionId,
        administrations
      } as IUtilisateur,
      {}
    )
  }

  return tokenCreate({ id })
}

export {
  queryImport,
  tokenCreate,
  graphQLCall,
  userTokenGenerate,
  restUploadCall
}
