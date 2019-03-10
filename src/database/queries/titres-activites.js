import titreActivites from '../models/titres-actvites'
import options from './_options'

const titresActiviteGet = async id =>
  titreActivites
    .query()
    .eager(options.titresActivites.eager)
    .findById(id)

const titresActivitesGet = async () =>
  titreActivites
    .query()
    .eager(options.titresActivites.eager)
    .skipUndefined()

const titreActiviteUpdate = async ({ titreActivite }) =>
  titreActivites
    .query()
    .eager(options.titresActivites.eager)
    .upsertGraph(titreActivite, { insertMissing: true })
    .first()

export { titresActiviteGet, titresActivitesGet, titreActiviteUpdate }
