import { raw, RawBuilder, QueryBuilder } from 'objection'

import {
  IUtilisateur,
  IFields,
  IUtilisateursColonneId,
  Index,
  IColonne
} from '../../types'

import options from './_options'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'
import { stringSplit } from './_utils'

import Utilisateurs from '../models/utilisateurs'
import { utilisateursQueryModify } from './permissions/utilisateurs'

const userGet = async (userId?: string) => {
  if (!userId) return null

  const user = await Utilisateurs.query().findById(userId)

  const q = utilisateursQueryBuild(
    { fields: { administrations: { id: {} }, entreprises: { id: {} } } },
    user
  )

  return q.findById(userId)
}

const utilisateursQueryBuild = (
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const graph = fields
    ? graphBuild(fields, 'utilisateur', fieldsFormat)
    : options.utilisateurs.graph

  const q = Utilisateurs.query().skipUndefined().withGraphFetched(graph)

  utilisateursQueryModify(q, user)

  return q
}

const utilisateursFiltersQueryModify = (
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
  q: QueryBuilder<Utilisateurs, Utilisateurs[]>
) => {
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
    ? graphBuild(fields, 'utilisateur', fieldsFormat)
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
    ? graphBuild(fields, 'utilisateur', fieldsFormat)
    : options.utilisateurs.graph

  return Utilisateurs.query()
    .withGraphFetched(graph)
    .where('refreshToken', refreshToken)
    .first()
}

const utilisateurGet = async (
  id: string,
  { fields }: { fields?: IFields } = {},
  user: IUtilisateur | null
) => {
  const q = utilisateursQueryBuild({ fields }, user)

  return q.findById(id)
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
} as Index<IColonne<string | RawBuilder>>

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
  user: IUtilisateur | null
) => {
  const q = utilisateursQueryBuild({ fields }, user)

  utilisateursFiltersQueryModify(
    {
      entrepriseIds,
      administrationIds,
      permissionIds,
      noms,
      emails
    },
    q
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
  user: IUtilisateur | null
) => {
  const q = utilisateursQueryBuild({ fields }, user)

  utilisateursFiltersQueryModify(
    {
      entrepriseIds,
      administrationIds,
      permissionIds,
      noms,
      emails
    },
    q
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
        ? graphBuild(fields, 'utilisateur', fieldsFormat)
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
        ? graphBuild(fields, 'utilisateur', fieldsFormat)
        : options.utilisateurs.graph
    )

const utilisateurUpdate = async (
  id: string,
  utilisateur: Partial<IUtilisateur>
) => Utilisateurs.query().patch(utilisateur).findById(id)

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
