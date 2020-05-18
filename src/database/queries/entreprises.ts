import { IEntreprise, IFields, IUtilisateur } from '../../types'
import Entreprises from '../models/entreprises'
import options from './_options'
import { entreprisePermissionQueryBuild } from './permissions/entreprises'
import graphBuild from './graph/build'
import graphFormat from './graph/format'
import { userGet } from './utilisateurs'

// import { userGet } from './utilisateurs'

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
  { noms }: { noms?: string[] },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const q = entreprisesQueryBuild({ fields }, user)

  q.orderBy('nom')

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
  entreprisesUpsert,
  entrepriseUpsert,
  entrepriseDelete
}
