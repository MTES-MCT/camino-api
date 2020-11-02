import { IActiviteType, ITitre, ITitreActivite } from '../../types'

import activitesTypesFilter from '../utils/activites-types-filter'
import activiteTypeAnneesFind from '../utils/activite-type-annees-find'
import { titreActivitesUpsert } from '../../database/queries/titres-activites'
import titreActivitesBuild from '../rules/titre-activites-build'

const titresActivitesUpdate = async (
  titres: ITitre[],
  activitesTypes: IActiviteType[]
) => {
  const titresActivitesCreated = activitesTypes.reduce(
    (acc: ITitreActivite[], activiteType) => {
      const annees = activiteTypeAnneesFind(activiteType)
      if (!annees.length) return acc

      acc.push(
        ...titres.reduce((acc: ITitreActivite[], titre) => {
          // filtre les types d'activités qui concernent le titre
          if (!activitesTypesFilter(activiteType, titre)) return acc

          acc.push(...titreActivitesBuild(titre, activiteType, annees))

          return acc
        }, [])
      )

      return acc
    },
    []
  )

  if (titresActivitesCreated.length) {
    await titreActivitesUpsert(titresActivitesCreated)

    console.info(
      `création: activité ${titresActivitesCreated.map(ta => ta.id).join(', ')}`
    )
  }

  return titresActivitesCreated.map(ta => ta.id)
}

export default titresActivitesUpdate
