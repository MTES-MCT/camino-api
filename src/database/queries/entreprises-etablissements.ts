import { IEntrepriseEtablissement } from '../../types'

import options from './_options'

import EntrepriseEtablissements from '../models/entreprises-etablissements'

const entrepriseEtablissementGet = async (id: string) =>
  EntrepriseEtablissements.query().findById(id)

const entreprisesEtablissementsGet = async () =>
  EntrepriseEtablissements.query()

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
