import { IEntrepriseEtablissement } from '../../types'
import EntrepriseEtablissements from '../models/entreprises-etablissements'
import options from './_options'

const entrepriseEtablissementGet = async (id: string) =>
  EntrepriseEtablissements.query().findById(id)

const entreprisesEtablissementsGet = async () =>
  EntrepriseEtablissements.query().skipUndefined()

const entreprisesEtablissementsUpsert = async (
  entreprisesEtablissements: IEntrepriseEtablissement[]
) =>
  EntrepriseEtablissements.query().upsertGraph(
    entreprisesEtablissements,
    options.entreprisesEtablissements.update
  )

const entreprisesEtablissementsDelete = async (
  entreprisesEtablissementsIds: string[]
) =>
  EntrepriseEtablissements.query()
    .delete()
    .whereIn('id', entreprisesEtablissementsIds)

export {
  entrepriseEtablissementGet,
  entreprisesEtablissementsGet,
  entreprisesEtablissementsUpsert,
  entreprisesEtablissementsDelete
}
