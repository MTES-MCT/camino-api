import titreActivitesTypesFilter from '../utils/titre-activites-filter'
import { titreActivitesUpsert } from '../../database/queries/titres-activites'
import titreActivitesBuild from '../rules/titre-activites-build'

const titresActivitesUpdate = async (titres, activitesTypes, annees) => {
  const titresActivitesCreated = titres
    // formate les pays des titres
    .reduce((acc, titre) => {
      // filtre les types d'activités qui concernent le titre
      const titreActivitesTypes = titreActivitesTypesFilter(
        titre,
        activitesTypes
      )

      if (titreActivitesTypes.length) {
        acc.push(
          ...titreActivitesTypes.reduce((acc, titreActiviteType) => {
            acc.push(...titreActivitesBuild(titre, titreActiviteType, annees))

            return acc
          }, [])
        )
      }

      return acc
    }, [])

  if (titresActivitesCreated.length) {
    await titreActivitesUpsert(titresActivitesCreated)

    console.log(
      `création: activité ${titresActivitesCreated.map(ta => ta.id).join(', ')}`
    )
  }

  return titresActivitesCreated
}

export default titresActivitesUpdate
