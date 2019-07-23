import { titreActivitesUpsert as titreActivitesUpsertQuery } from '../../database/queries/titres-activites'

const titreActivitesUpsert = async titreActivites => {
  await titreActivitesUpsertQuery(titreActivites)

  return `Création: activité ${titreActivites.map(ta => ta.id).join(', ')}`
}

export { titreActivitesUpsert }
