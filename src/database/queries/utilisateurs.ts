import {
  IUtilisateur,
  IFields,
  IUtilisateursColonneId,
  Index,
  IColonne
} from '../../types'

import Utilisateurs from '../models/utilisateurs'
import options from './_options'
import { utilisateursPermissionQueryBuild } from './permissions/utilisateurs'

import graphBuild from './graph/build'
import graphFormat from './graph/format'
import { raw } from 'objection'

import { stringSplit } from './_utils'
import Objection = require('objection')

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
  {
    entrepriseIds,
    administrationIds,
    permissionIds,
    noms,
    prenoms,
    email
  }: {
    entrepriseIds?: string[] | undefined
    administrationIds?: string[] | undefined
    permissionIds?: string[] | undefined
    noms?: string | null
    prenoms?: string | null
    email?: string | null
  },
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
    const nomsArray = stringSplit(noms)
    q.whereRaw(`lower(??) ~* ?`, [
      'utilisateurs.nom',
      nomsArray.map(n => n.toLowerCase()).join('|')
    ])
  }

  if (prenoms) {
    const prenomsArray = stringSplit(prenoms)
    q.whereRaw(`lower(??) ~* ?`, [
      'utilisateurs.prenom',
      prenomsArray.map(n => n.toLowerCase()).join('|')
    ])
  }

  if (email) {
    q.whereRaw(`lower(??) like ?`, [
      'utilisateurs.email',
      `%${email.toLowerCase()}%`
    ])
  }

  return q
}

const userByEmailGet = async (
  email: string,
  { fields }: { fields?: IFields } = {}
) => {
  const graph = fields
    ? graphBuild(fields, 'utilisateur', graphFormat)
    : options.utilisateurs.graph

  return Utilisateurs.query()
    .withGraphFetched(graph)
    .where('email', email)
    .first()
}

const utilisateurGet = async (
  id: string,
  { fields }: { fields?: IFields } = {},
  userId?: string
) => {
  const user = await userGet(userId)

  const q = utilisateursQueryBuild({}, { fields }, user)

  return (await q.findById(id)) as IUtilisateur
}

const utilisateursColonnes = {
  nom: {
    id: 'nom'
  },
  prenom: {
    id: 'prenom'
  },
  email: {
    id: 'email'
  },
  permissions: { id: 'permissionId' },
  lien: {
    id: raw(`CONCAT(STRING_AGG (
    "administrations"."nom",
    ';'
    order by "administrations"."nom"),STRING_AGG (
    "entreprises"."nom",
    ';'
    order by "entreprises"."nom"))`),
    relation: '[administrations,entreprises]',
    groupBy: 'utilisateurs.id'
  }
} as Index<IColonne<string | Objection.RawBuilder>>

const utilisateursGet = async (
  {
    intervalle,
    page,
    colonne,
    ordre,
    entrepriseIds,
    administrationIds,
    permissionIds,
    noms,
    prenoms,
    email
  }: {
    intervalle?: number | null
    page?: number | null
    colonne?: IUtilisateursColonneId | null
    ordre?: 'asc' | 'desc' | null
    entrepriseIds?: string[] | undefined
    administrationIds?: string[] | undefined
    permissionIds?: string[] | undefined
    noms?: string | null
    prenoms?: string | null
    email?: string | null
  },
  { fields }: { fields?: IFields } = {},
  userId?: string
) => {
  const user = await userGet(userId)
  const q = utilisateursQueryBuild(
    {
      entrepriseIds,
      administrationIds,
      permissionIds,
      noms,
      prenoms,
      email
    },
    { fields },
    user
  )

  if (colonne) {
    if (utilisateursColonnes[colonne].relation) {
      q.leftJoinRelated(utilisateursColonnes[colonne].relation!)
      if (utilisateursColonnes[colonne].groupBy) {
        q.groupBy(utilisateursColonnes[colonne].groupBy as string)
      }
    }
    q.orderBy(utilisateursColonnes[colonne].id, ordre || 'asc')
  } else {
    q.orderBy('utilisateurs.nom', 'asc')
  }

  if (page && intervalle) {
    q.offset((page - 1) * intervalle)
  }

  if (intervalle) {
    q.limit(intervalle)
  }

  return q
}

const utilisateursCount = async (
  {
    entrepriseIds,
    administrationIds,
    permissionIds,
    noms,
    prenoms,
    email
  }: {
    entrepriseIds?: string[] | undefined
    administrationIds?: string[] | undefined
    permissionIds?: string[] | undefined
    noms?: string | null
    prenoms?: string | null
    email?: string | null
  },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)
  const q = utilisateursQueryBuild(
    {
      entrepriseIds,
      administrationIds,
      permissionIds,
      noms,
      prenoms,
      email
    },
    { fields },
    user
  )

  const utilisateurs = ((await q) as unknown) as { total: number }[]

  return utilisateurs.length
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
  utilisateursCount,
  utilisateurCreate,
  utilisateurUpdate
}
