import {
  IEntreprise,
  IFields,
  IUtilisateur,
  IEntrepriseColonneId
} from '../../types'
import Entreprises from '../models/entreprises'
import options from './_options'
import { entreprisesQueryModify } from './permissions/entreprises'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'
import { stringSplit } from './_utils'
import { raw, QueryBuilder } from 'objection'

const entreprisesFiltersQueryModify = (
  {
    noms,
    archive
  }: {
    noms?: string | null
    archive?: boolean | null
  },
  q: QueryBuilder<Entreprises, Entreprises[]>
) => {
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
}

const entreprisesQueryBuild = (
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const graph = fields
    ? graphBuild(fields, 'entreprises', fieldsFormat)
    : options.entreprises.graph

  const q = Entreprises.query().skipUndefined().withGraphFetched(graph)

  entreprisesQueryModify(q, { fields }, user)

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
  user: IUtilisateur | null
) => {
  const q = entreprisesQueryBuild({ fields }, user)

  entreprisesFiltersQueryModify({ noms, archive }, q)
  if (!q) return 0

  const entreprises = ((await q) as unknown) as { total: number }[]

  return entreprises.length
}

const entrepriseGet = async (
  id: string,
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const q = entreprisesQueryBuild({ fields }, user)

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
  user: IUtilisateur | null
) => {
  const q = entreprisesQueryBuild({ fields }, user)

  entreprisesFiltersQueryModify({ noms, archive }, q)

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
  entrepriseDelete,
  entreprisesQueryBuild
}
