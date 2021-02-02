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

  // utilisé en interne (daily, monthly, etc.)
  if (userId === 'super') {
    return { permissionId: 'super', id: 'super' } as IUtilisateur
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
    emails
  }: {
    entrepriseIds?: string[]
    administrationIds?: string[]
    permissionIds?: string[]
    noms?: string | null
    emails?: string | null
  },
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const graph = fields
    ? graphBuild(fields, 'utilisateur', graphFormat)
    : options.utilisateurs.graph

  const q = Utilisateurs.query().skipUndefined().withGraphFetched(graph)

  utilisateursPermissionQueryBuild(q, fields, user)

  if (permissionIds) {
    q.whereIn('permissionId', permissionIds)
  }

  if (administrationIds) {
    q.whereIn('administrations.id', administrationIds).leftJoinRelated(
      'administrations'
    )
  }

  if (entrepriseIds) {
    q.whereIn('entreprises.id', entrepriseIds).leftJoinRelated('entreprises')
  }

  if (noms) {
    const nomsArray = stringSplit(noms)
    const fields = ['nom', 'prenom']

    nomsArray.forEach(s => {
      q.where(b => {
        fields.forEach(f => {
          b.orWhereRaw(`lower(??) like ?`, [
            `utilisateurs.${f}`,
            `%${s.toLowerCase()}%`
          ])
        })
      })
    })
  }

  if (emails) {
    const emailsArray = stringSplit(emails)
    q.where(b => {
      b.whereRaw(`?? ~* ?`, [
        'utilisateurs.email',
        emailsArray.map(n => `(?=.*?(${n}))`).join('')
      ])
    })
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

const userByRefreshTokenGet = async (
  refreshToken: string,
  { fields }: { fields?: IFields } = {}
) => {
  const graph = fields
    ? graphBuild(fields, 'utilisateur', graphFormat)
    : options.utilisateurs.graph

  return Utilisateurs.query()
    .withGraphFetched(graph)
    .where('refreshToken', refreshToken)
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

// lien = administration ou entreprise(s) en relation avec l'utilisateur :
// on trie sur la concaténation du nom de l'administration
// avec l'aggrégation ordonnée(STRING_AGG) des noms des entreprises
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
    id: raw(`CONCAT(
      "administrations"."nom",
      STRING_AGG(
        "entreprises"."nom",
        ' ; '
        order by "entreprises"."nom"
      )
    )`),
    relation: '[administrations, entreprises]',
    groupBy: ['utilisateurs.id', 'administrations.id']
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
    emails
  }: {
    intervalle?: number | null
    page?: number | null
    colonne?: IUtilisateursColonneId | null
    ordre?: 'asc' | 'desc' | null
    entrepriseIds?: string[]
    administrationIds?: string[]
    permissionIds?: string[]
    noms?: string | null
    emails?: string | null
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
      emails
    },
    { fields },
    user
  )

  if (colonne) {
    if (utilisateursColonnes[colonne].relation) {
      q.leftJoinRelated(utilisateursColonnes[colonne].relation!)
      const groupBy = utilisateursColonnes[colonne].groupBy as string[]
      if (groupBy) {
        groupBy.forEach(gb => {
          q.groupBy(gb as string)
        })
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
    emails
  }: {
    entrepriseIds?: string[] | undefined
    administrationIds?: string[] | undefined
    permissionIds?: string[] | undefined
    noms?: string | null
    emails?: string | null
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
      emails
    },
    { fields },
    user
  )

  const utilisateurs = ((await q) as unknown) as { total: number }[]

  return utilisateurs.length
}

const utilisateurCreate = async (
  utilisateur: IUtilisateur,
  { fields }: { fields?: IFields }
) =>
  Utilisateurs.query()
    .insertGraph(utilisateur, options.utilisateurs.update)
    .withGraphFetched(
      fields
        ? graphBuild(fields, 'utilisateur', graphFormat)
        : options.utilisateurs.graph
    )
    .first()

const utilisateurUpsert = async (
  utilisateur: IUtilisateur,
  { fields }: { fields?: IFields }
) =>
  Utilisateurs.query()
    .upsertGraphAndFetch(utilisateur, options.utilisateurs.update)
    .withGraphFetched(
      fields
        ? graphBuild(fields, 'utilisateur', graphFormat)
        : options.utilisateurs.graph
    )

const utilisateurUpdate = async (
  id: string,
  props: Partial<IUtilisateur>,
  { fields }: { fields?: IFields }
) =>
  Utilisateurs.query()
    .withGraphFetched(
      fields
        ? graphBuild(fields, 'utilisateur', graphFormat)
        : options.utilisateurs.graph
    )
    .patchAndFetchById(id, props)

export {
  userGet,
  utilisateurGet,
  userByEmailGet,
  userByRefreshTokenGet,
  utilisateursGet,
  utilisateursCount,
  utilisateurCreate,
  utilisateurUpsert,
  utilisateurUpdate
}
