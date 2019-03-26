import EntrepriseEtablissements from '../models/entreprises-etablissements'
import options from './_options'

const entrepriseEtablissementGet = async id =>
  EntrepriseEtablissements.query().findById(id)

const entreprisesEtablissementsGet = async () =>
  EntrepriseEtablissements.query().skipUndefined()

const entrepriseEtablissementUpdate = async entrepriseEtablissement =>
  EntrepriseEtablissements.query().upsertGraph(
    entrepriseEtablissement,
    options.entreprisesEtablissements.update
  )

export {
  entrepriseEtablissementGet,
  entreprisesEtablissementsGet,
  entrepriseEtablissementUpdate
}
