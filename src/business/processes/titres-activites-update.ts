import { ITitres, IActivitesTypes, ITitresActivites } from '../../types'

import activitesTypesFilter from '../utils/activites-types-filter'
import activiteTypeAnneesFind from '../utils/activite-type-annees-find'
import { titreActivitesUpsert } from '../../database/queries/titres-activites'
import titreActivitesBuild from '../rules/titre-activites-build'

const titresActivitesUpdate = async (
  titres: ITitres[],
  activitesTypes: IActivitesTypes[]
) => {
  const titresActivitesCreated = activitesTypes.reduce(
    (acc: ITitresActivites[], activiteType) => {
      const annees = activiteTypeAnneesFind(activiteType)
      if (!annees.length) return acc

      acc.push(
        ...titres.reduce((acc: ITitresActivites[], titre) => {
          // filtre les types d'activités qui concernent le titre
          if (!activitesTypesFilter(titre, activiteType)) return acc

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

    console.log(
      `création: activité ${titresActivitesCreated.map(ta => ta.id).join(', ')}`
    )
  }

  return titresActivitesCreated
}

export default titresActivitesUpdate
