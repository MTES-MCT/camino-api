import titreActivites from '../models/titres-actvites'

const titresActiviteGet = async id => titreActivites.query().findById(id)

const titresActivitesGet = async () => titreActivites.query().skipUndefined()

const titreActiviteUpdate = async ({ titreActivite }) =>
  titreActivites
    .query()
    .upsertGraph(titreActivite, { insertMissing: true })
    .first()

export { titresActiviteGet, titresActivitesGet, titreActiviteUpdate }
