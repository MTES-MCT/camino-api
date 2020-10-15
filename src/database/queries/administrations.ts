import {
  IAdministration,
  IAdministrationColonneId,
  IFields,
  IUtilisateur
} from '../../types'
import Administrations from '../models/administrations'
import options from './_options'
import { administrationsPermissionQueryBuild } from './permissions/administrations'

import { userGet } from './utilisateurs'

import graphBuild from './graph/build'
import graphFormat from './graph/format'
import { stringSplit } from './_utils'

const administrationsQueryBuild = (
  { noms, typesIds }: { noms?: string | null; typesIds?: string[] | null },
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const graph = fields
    ? graphBuild(fields, 'administrations', graphFormat)
    : options.administrations.graph

  const q = Administrations.query().withGraphFetched(graph)

  administrationsPermissionQueryBuild(q, fields, user)

  if (noms) {
    const nomsArray = stringSplit(noms)

    if (nomsArray) {
      const fields = ['administrations.id', 'administrations.nom']

      nomsArray.forEach(s => {
        q.where(b => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })
    }
  }

  if (typesIds) {
    q.leftJoinRelated('type')

    q.whereIn('type.id', typesIds)
  }

  return q
}

const administrationGet = async (
  id: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const q = administrationsQueryBuild({}, { fields }, user)

  return (await q.findById(id)) as IAdministration
}

const administrationsCount = async (
  { noms, typesIds }: { noms?: string | null; typesIds?: string[] | null },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)
  const q = administrationsQueryBuild({ noms, typesIds }, { fields }, user)
  if (!q) return 0

  const administrations = ((await q) as unknown) as { total: number }[]

  return administrations.length
}

const administrationsGet = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  {
    page,
    intervalle,
    ordre,
    colonne,
    noms,
    typesIds
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: IAdministrationColonneId | null
    noms?: string | null
    typesIds?: string[] | null
  },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const q = administrationsQueryBuild({ noms, typesIds }, { fields }, user)

  // type: { id: 'type:type.nom', relation: 'type.type' }
  if (colonne && colonne === 'type') {
    q.leftJoinRelated('type')
    q.groupBy('administrations.id')
    q.groupBy('type.nom')

    q.orderBy('type.nom', ordre || 'asc')
  } else if (colonne && colonne === 'nom') {
    q.orderBy('administrations.nom', ordre || 'asc')
  } else if (colonne && colonne === 'abreviation') {
    q.orderBy('administrations.abreviation', ordre || 'asc')
  } else {
    q.orderBy('administrations.nom')
  }

  if (page && intervalle) {
    q.offset((page - 1) * intervalle)
  }

  if (intervalle) {
    q.limit(intervalle)
  }

  return q.skipUndefined()
}

const administrationsUpsert = async (administrations: IAdministration[]) =>
  Administrations.query()
    .withGraphFetched(options.administrations.graph)
    .upsertGraph(administrations, options.administrations.update)

export {
  administrationGet,
  administrationsGet,
  administrationsCount,
  administrationsUpsert
}
