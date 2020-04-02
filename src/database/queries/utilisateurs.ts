import { IUtilisateur, IFields } from '../../types'

import Utilisateurs from '../models/utilisateurs'
import options from './_options'
import { utilisateursPermissionQueryBuild } from './_permissions'

import graphBuild from './graph/build'
import graphFormat from './graph/format'

const userGet = async (userId?: string) => {
  if (!userId) return undefined

  if (userId === 'super') {
    return ({ permissionId: 'super' } as unknown) as IUtilisateur
  }

  return Utilisateurs.query()
    .withGraphFetched(options.utilisateurs.graph)
    .findById(userId)
}

const utilisateursQueryBuild = (
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const graph = fields
    ? graphBuild(fields, 'utilisateur', graphFormat)
    : options.utilisateurs.graph

  const q = Utilisateurs.query()
    .skipUndefined()
    .withGraphFetched(graph)

  utilisateursPermissionQueryBuild(q, user)

  return q
}

const utilisateurGet = async (
  id: string,
  { fields }: { fields?: IFields } = {},
  userId?: string
) => {
  const user = await userGet(userId)

  const q = utilisateursQueryBuild({ fields }, user)

  return (await q.findById(id)) as IUtilisateur
}

const userByEmailGet = async (email: string) =>
  Utilisateurs.query()
    .where('email', email)
    .first()

const utilisateursGet = async (
  {
    noms,
    entrepriseIds,
    administrationIds,
    permissionIds
  }: {
    noms?: string[]
    entrepriseIds?: string[]
    administrationIds?: string[]
    permissionIds?: string[]
  },
  { fields }: { fields?: IFields } = {},
  userId?: string
) => {
  const user = await userGet(userId)
  const q = utilisateursQueryBuild({ fields }, user)

  q.orderBy('utilisateurs.nom')

  if (administrationIds) {
    q.whereIn('administrations.id', administrationIds).joinRelated(
      'administrations'
    )
  }

  if (permissionIds) {
    q.whereIn('permissionId', permissionIds)
  }

  if (entrepriseIds) {
    q.whereIn('entreprises.id', entrepriseIds).joinRelated('entreprises')
  }

  if (noms) {
    q.whereRaw(`lower(??) ~* ${noms.map(n => '?').join('|')}`, [
      'utilisateurs.nom',
      ...noms.map(n => n.toLowerCase())
    ])
  }

  return q
}

const utilisateurCreate = async (utilisateur: IUtilisateur) =>
  Utilisateurs.query()
    .insertGraph(utilisateur, options.utilisateurs.update)
    .withGraphFetched(options.utilisateurs.graph)
    .first()

const utilisateurUpdate = async (utilisateur: IUtilisateur) =>
  Utilisateurs.query()
    .upsertGraphAndFetch(utilisateur, options.utilisateurs.update)
    .withGraphFetched(options.utilisateurs.graph)

export {
  userGet,
  utilisateurGet,
  userByEmailGet,
  utilisateursGet,
  utilisateurCreate,
  utilisateurUpdate
}
