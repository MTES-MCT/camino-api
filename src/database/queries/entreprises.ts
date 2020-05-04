import {
  IEntreprise,
  IFields,
  IUtilisateur,
  IEntrepriseColonneId
} from '../../types'
import Entreprises from '../models/entreprises'
import options from './_options'
import { entreprisePermissionQueryBuild } from './permissions/entreprises'
import graphBuild from './graph/build'
import graphFormat from './graph/format'
import { userGet } from './utilisateurs'
// import { stringSplit } from './_utils'

const stringSplit = (string: string) =>
  (string.match(/[\w-/]+|"(?:\\"|[^"])+"/g) || []).map(e =>
    e.replace(/^"(.*)"$/, '$1')
  )

const entreprisesQueryBuild = (
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const graph = fields
    ? graphBuild(fields, 'entreprises', graphFormat)
    : options.entreprises.graph

  const q = Entreprises.query()
    .skipUndefined()
    .withGraphFetched(graph)

  entreprisePermissionQueryBuild(q, user)

  return q
}

const entreprisesCount = async (
  {
    nomSiren,
    legalSiren
  }: {
    nomSiren?: string | null
    legalSiren?: string | null
  },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const q = entreprisesQueryBuild({ fields }, user)
  if (!q) return 0

  if (nomSiren) {
    const nomSirenArray = stringSplit(nomSiren)
    const fields = ['entreprises.id', 'entreprises.nom']

    nomSirenArray.forEach(s => {
      q.where(b => {
        fields.forEach(f => {
          b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
        })
      })
    })
  }

  if (legalSiren) {
    q.where('entreprises.legalSiren', legalSiren)
  }

  const titresActivites = ((await q) as unknown) as { total: number }[]

  return titresActivites.length
}

const entrepriseGet = async (
  id: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const q = entreprisesQueryBuild({ fields }, user)

  return (await q.findById(id)) as IEntreprise
}

const entreprisesGet = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  {
    page,
    intervalle,
    ordre,
    colonne,
    noms
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: IEntrepriseColonneId | null
    noms?: string[] | null
  },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const q = entreprisesQueryBuild({ fields }, user)
  if (!q) return []

  if (noms) {
    // const nomSirenArray = stringSplit(noms)
    const fields = ['entreprises.id', 'entreprises.nom']

    noms.forEach(s => {
      q.where(b => {
        fields.forEach(f => {
          b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
        })
      })
    })
  }

  if (colonne) {
    q.orderBy(`entreprises.${colonne}`, ordre || 'asc')
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
  Entreprises.query()
    .deleteById(id)
    .first()
    .returning('*')

export {
  entrepriseGet,
  entreprisesGet,
  entreprisesCount,
  entreprisesUpsert,
  entrepriseUpsert,
  entrepriseDelete
}
