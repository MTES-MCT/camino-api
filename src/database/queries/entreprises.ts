import {
  IEntreprise,
  IFields,
  IUtilisateur,
  IEntrepriseColonneId
} from '../../types'
import Entreprises from '../models/entreprises'
import options from './_options'
import { entrepriseQueryModify } from './permissions/entreprises'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'
import { userGet } from './utilisateurs'
import { stringSplit } from './_utils'
import { raw } from 'objection'

const entreprisesQueryBuild = (
  {
    noms,
    archive
  }: {
    noms?: string | null
    archive?: boolean | null
  },
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const graph = fields
    ? graphBuild(fields, 'entreprises', fieldsFormat)
    : options.entreprises.graph

  const q = Entreprises.query().skipUndefined().withGraphFetched(graph)

  entrepriseQueryModify(q, fields, user)

  if (noms) {
    const nomsArray = stringSplit(noms)

    if (nomsArray) {
      const fields = [
        'entreprises.id',
        'entreprises.nom',
        'etablissements.nom',
        'etablissements.legalSiret'
      ]

      q.leftJoinRelated('etablissements')
      q.groupBy('entreprises.id')

      nomsArray.forEach(s => {
        q.where(b => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })
    }
  }

  if (archive !== undefined && archive !== null) {
    q.where('entreprises.archive', archive)
  }

  return q
}

const entreprisesCount = async (
  {
    noms,
    archive
  }: {
    noms?: string | null
    archive?: boolean | null
  },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)
  const q = entreprisesQueryBuild({ noms, archive }, { fields }, user)
  if (!q) return 0

  const entreprises = ((await q) as unknown) as { total: number }[]

  return entreprises.length
}

const entrepriseGet = async (
  id: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const q = entreprisesQueryBuild({}, { fields }, user)

  return (await q.findById(id)) as IEntreprise
}

const entreprisesGet = async (
  {
    page,
    intervalle,
    ordre,
    colonne,
    noms,
    archive
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: IEntrepriseColonneId | null
    noms?: string | null
    archive?: boolean | null
  },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const q = entreprisesQueryBuild({ noms, archive }, { fields }, user)
  if (!q) return []

  // le tri sur la colonne 'siren' s'effectue sur le legal_siren ET le legal_etranger
  if (colonne && colonne === 'siren') {
    q.orderBy(
      raw(`CONCAT(
        "entreprises"."legal_siren",
        "entreprises"."legal_etranger"
      )`),
      ordre || 'asc'
    )
  } else {
    q.orderBy('entreprises.nom', ordre || 'asc')
  }

  if (page && intervalle) {
    q.offset((page - 1) * intervalle)
  }

  if (intervalle) {
    q.limit(intervalle)
  }

  return q
}

const entreprisesUpsert = async (entreprises: IEntreprise[]) =>
  Entreprises.query()
    .withGraphFetched(options.entreprises.graph)
    .upsertGraph(entreprises, options.entreprises.update)

const entrepriseUpsert = async (entreprise: IEntreprise) =>
  Entreprises.query()
    .withGraphFetched(options.entreprises.graph)
    .upsertGraph(entreprise, options.entreprises.update)
    .returning('*')

const entrepriseDelete = async (id: string) =>
  Entreprises.query().deleteById(id).first().returning('*')

export {
  entrepriseGet,
  entreprisesGet,
  entreprisesCount,
  entreprisesUpsert,
  entrepriseUpsert,
  entrepriseDelete
}
