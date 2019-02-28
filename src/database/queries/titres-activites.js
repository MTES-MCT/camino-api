import titreActivitesRapports from '../models/titres-actvites-rapports'

const titresActivitesRapportGet = async id =>
  titreActivitesRapports.query().findById(id)

const titresActivitesRapportsGet = async () =>
  titreActivitesRapports.query().skipUndefined()

const titreActivitesRapportUpdate = async ({ titreActivitesRapport }) =>
  titreActivitesRapports
    .query()
    .upsertGraph(titreActivitesRapport, { insertMissing: true })
    .first()

export {
  titresActivitesRapportGet,
  titresActivitesRapportsGet,
  titreActivitesRapportUpdate
}
