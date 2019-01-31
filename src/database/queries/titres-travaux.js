import titreTravauxRapports from '../models/titres-travaux-rapports'

const titresTravauxRapportGet = async id =>
  titreTravauxRapports.query().findById(id)

const titresTravauxRapportsGet = async () =>
  titreTravauxRapports.query().skipUndefined()

const titreTravauxRapportUpdate = async ({ titreTravauxRapport }) =>
  titreTravauxRapports
    .query()
    .upsertGraph(titreTravauxRapport, { insertMissing: true })
    .first()

export {
  titresTravauxRapportGet,
  titresTravauxRapportsGet,
  titreTravauxRapportUpdate
}
