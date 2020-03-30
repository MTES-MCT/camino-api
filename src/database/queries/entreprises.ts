import { IEntreprise, IFields } from '../../types'
import Entreprises from '../models/entreprises'
import options from './_options'
import graphBuild from './graph/build'
import graphFormat from './graph/format'

// import { userGet } from './utilisateurs'

const entrepriseGet = async (
  id: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  // const user = userId && (await userGet(userId))

  const graph = fields
    ? graphBuild(fields, 'entreprises', graphFormat)
    : options.entreprises.graph

  return Entreprises.query()
    .findById(id)
    .withGraphFetched(graph)
}

const entreprisesGet = async (
  _: any,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  // const user = userId && (await userGet(userId))

  const graph = fields
    ? graphBuild(fields, 'entreprises', graphFormat)
    : options.entreprises.graph

  return Entreprises.query()
    .skipUndefined()
    .withGraphFetched(graph)
    .orderBy('nom')
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
