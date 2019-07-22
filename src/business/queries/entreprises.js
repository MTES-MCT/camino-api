import { entreprisesUpsert as entreprisesUpsertQuery } from '../../database/queries/entreprises'
import { entreprisesEtablissementsUpsert as entreprisesEtablissementsUpsertQuery } from '../../database/queries/entreprises-etablissements'

const entreprisesUpsert = async entreprises => {
  await entreprisesUpsertQuery(entreprises)

  return `Mise à jour: entreprise ${entreprises.map(e => e.id).join(', ')}`
}

const entreprisesEtablissementsUpsert = async entreprisesEtablissements => {
  await entreprisesEtablissementsUpsertQuery(entreprisesEtablissements)

  return `Mise à jour: entreprisesEtablissements ${entreprisesEtablissements
    .map(e => e.id)
    .join(', ')}`
}

export { entreprisesUpsert, entreprisesEtablissementsUpsert }
