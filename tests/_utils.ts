import * as fs from 'fs'
import * as path from 'path'
import * as jwt from 'jsonwebtoken'

import { IAdministration, IPermissionId, IUtilisateur } from '../src/types'
import * as request from 'supertest'
import { app } from './init'
import {
  utilisateurCreate,
  utilisateurGet
} from '../src/database/queries/utilisateurs'

const queryImport = (nom: string) =>
  fs
    .readFileSync(path.join(__dirname, `./queries/${nom}.graphql`))
    // important pour transformer le buffer en string
    .toString()

const tokenCreate = (user: Partial<IUtilisateur>) =>
  jwt.sign(user, process.env.JWT_SECRET as string)

const graphQLCall = async (
  query: string,
  variables: unknown,
  permissionId?: IPermissionId,
  administrationId?: string
) => {
  let token
  if (permissionId) {
    token = await tokenUserGenerate(permissionId, administrationId)
  }

  const req = request(app).post('/').send({
    query,
    variables
  })

  if (token) {
    req.set('Authorization', `Bearer ${token}`)
  }

  return req
}

const tokenUserGenerate = async (
  permissionId: IPermissionId,
  administrationId?: string
) => {
  const id = permissionId !== 'super' ? `${permissionId}-user` : 'super'

  const userInDb = await utilisateurGet(id, undefined, 'super')
  if (!userInDb) {
    const administrations = []
    if (administrationId) {
      administrations.push(({
        id: administrationId
      } as unknown) as IAdministration)
    }

    await utilisateurCreate(
      ({
        id,
        prenom: `prenom-${permissionId}`,
        nom: `nom-${permissionId}`,
        email: `test-${permissionId}@camino.local`,
        motDePasse: 'mot-de-passe',
        permissionId,
        administrations
      } as unknown) as IUtilisateur,
      {}
    )
  }

  return tokenCreate({ id })
}

export { queryImport, tokenCreate, graphQLCall, tokenUserGenerate }
