import { ITitreActivite } from '../../types'

import activitesTypesFilter from '../utils/activites-types-filter'
import activiteTypeAnneesFind from '../utils/activite-type-annees-find'
import { titreActivitesUpsert } from '../../database/queries/titres-activites'
import titreActivitesBuild from '../rules/titre-activites-build'
import { titresGet } from '../../database/queries/titres'
import { activitesTypesGet } from '../../database/queries/metas'

const titresActivitesUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('activités des titres…')

  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        demarches: { phase: { id: {} } },
        communes: { departement: { region: { pays: { id: {} } } } },
        activites: { id: {} }
      }
    },
    'super'
  )
  const activitesTypes = await activitesTypesGet({}, 'super')

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

    const log = {
      type: 'titre / activités (création) ->',
      value: titresActivitesCreated.map(ta => ta.id).join(', ')
    }

    console.info(log.type, log.value)
  }

  return titresActivitesCreated.map(ta => ta.id)
}

export default titresActivitesUpdate
