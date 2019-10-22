import Entreprises from '../models/entreprises'
import options from './_options'

const entrepriseGet = async (id, { eager = options.entreprises.eager } = {}) =>
  Entreprises.query()
    .findById(id)
    .eager(eager)

const entreprisesGet = async (
  args,
  { eager = options.entreprises.eager } = {}
) =>
  Entreprises.query()
    .skipUndefined()
    .eager(eager)

const entreprisesUpsert = async entreprises =>
  Entreprises.query()
    .eager(options.entreprises.eager)
    .upsertGraph(entreprises, options.entreprises.update)

const entrepriseBySiren = async (
  siren,
  { eager = options.entreprises.eager } = {}
) => {
  const entreprise = Entreprises.query()
    .where({ legalSiren: siren })
    .eager(eager)
    .first()
  console.log(entreprise)

  return entreprise
}

const entrepriseCreate = async entreprise =>
  Entreprises.query().insert(entreprise)

export {
  entrepriseGet,
  entreprisesGet,
  entreprisesUpsert,
  entrepriseBySiren,
  entrepriseCreate
}
