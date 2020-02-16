import { IEntreprise } from '../../types'
import Entreprises from '../models/entreprises'
import options from './_options'

const entrepriseGet = async (
  id: string,
  { graph = options.entreprises.graph } = {}
) =>
  Entreprises.query()
    .findById(id)
    .withGraphFetched(graph)

const entreprisesGet = async (
  _?: any,
  { graph = options.entreprises.graph } = {}
) =>
  Entreprises.query()
    .skipUndefined()
    .withGraphFetched(graph)
    .orderBy('nom')

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
