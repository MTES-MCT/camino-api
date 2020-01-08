import TitreActivites from '../models/titres-activites'
import options from './_options'
// import * as sqlFormatter from 'sql-formatter'

const titreActiviteGet = async (
  id,
  { graph = options.titresActivites.graph }
) =>
  TitreActivites.query()
    .withGraphFetched(graph)
    .findById(id)
    .first()

const titresActivitesGet = async (
  { typeId, annee } = {},
  { graph = options.titresActivites.graph } = {}
) => {
  const q = TitreActivites.query().withGraphFetched(graph)

  if (typeId) {
    q.where('titresActivites.activiteTypeId', typeId)
  }

  if (annee) {
    q.where('titresActivites.annee', Number(annee))
  }

  return q
}

const titreActivitesUpsert = async titreActivites =>
  TitreActivites.query()
    .withGraphFetched(options.titresActivites.graph)
    .upsertGraph(titreActivites, { insertMissing: true })

const titreActiviteUpdate = async (id, props) =>
  TitreActivites.query()
    .withGraphFetched(options.titresActivites.graph)
    .patchAndFetchById(id, props)

export {
  titreActiviteGet,
  titreActivitesUpsert,
  titresActivitesGet,
  titreActiviteUpdate
}
