import * as fs from 'fs'
import * as path from 'path'
import * as jwt from 'jsonwebtoken'

import { IPermissionId, IUtilisateur } from '../src/types'
import * as request from 'supertest'
import { app, knex } from './init'
import userAdd = require('../knex/user-add')

const queryImport = (nom: string) =>
  fs
    .readFileSync(path.join(__dirname, `./queries/${nom}.graphql`))
    // important pour transformer le buffer en string
    .toString()

const tokenCreate = (user: Partial<IUtilisateur>) =>
  jwt.sign(user, process.env.JWT_SECRET as string)

const graphQLCall = async (query: string, variables: {}, token?: string) => {
  const req = request(app).post('/').send({
    query,
    variables
  })

  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }

  return req
}

const tokenUserGenerate = async (permissionId: IPermissionId) => {
  const id = `${permissionId}-user`
  await userAdd(knex, {
    id,
    prenom: 'toto',
    nom: 'test',
    email: `test-${permissionId}@camino.local`,
    motDePasse: 'mot-de-passe',
    permissionId
  })

  return tokenCreate({ id })
}

export { queryImport, tokenCreate, graphQLCall, tokenUserGenerate }
