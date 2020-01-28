import titreActiviteTypeFilter from '../utils/titre-activite-filter'
import titreActiviteTypeAnneesFind from '../utils/titre-activite-type-annees-find'
import { titreActivitesUpsert } from '../../database/queries/titres-activites'
import titreActivitesBuild from '../rules/titre-activites-build'

const titresActivitesUpdate = async (titres, activitesTypes) => {
  const titresActivitesCreated = activitesTypes.reduce(
    (acc, titreActiviteType) => {
      const annees = titreActiviteTypeAnneesFind(titreActiviteType)
      if (!annees.length) return acc

      acc.push(
        ...titres.reduce((acc, titre) => {
          // filtre les types d'activités qui concernent le titre
          if (!titreActiviteTypeFilter(titre, titreActiviteType)) return acc

          acc.push(...titreActivitesBuild(titre, titreActiviteType, annees))

          return acc
        }, [])
      )

      return acc
    },
    []
  )

  if (titresActivitesCreated.length) {
    await titreActivitesUpsert(titresActivitesCreated)

    console.log(
      `création: activité ${titresActivitesCreated.map(ta => ta.id).join(', ')}`
    )
  }

  return titresActivitesCreated
}

export default titresActivitesUpdate
