import { ITitreActivite } from '../../types'
import * as dateFormat from 'dateformat'

import { titreActiviteTypeCheck } from '../utils/titre-activite-type-check'
import { activiteTypeAnneesFind } from '../utils/activite-type-annees-find'
import { titresActivitesUpsert } from '../../database/queries/titres-activites'
import { titreActivitesBuild } from '../rules/titre-activites-build'
import { titresGet } from '../../database/queries/titres'
import { activitesTypesGet } from '../../database/queries/metas-activites'

const titresActivitesUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('activités des titres…')

  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        demarches: {
          phase: { id: {} },
          etapes: {
            substances: { legales: { fiscales: { unite: { id: {} } } } }
          }
        },
        communes: { departement: { region: { pays: { id: {} } } } },
        activites: { id: {} }
      }
    },
    'super'
  )

  const activitesTypes = await activitesTypesGet({}, 'super')
  const aujourdhui = dateFormat(new Date(), 'yyyy-mm-dd')
  const annee = new Date().getFullYear()

  const titresActivitesCreated = activitesTypes.reduce(
    (acc: ITitreActivite[], activiteType) => {
      const annees = activiteTypeAnneesFind(activiteType, annee)
      if (!annees.length) return acc

      acc.push(
        ...titres.reduce((acc: ITitreActivite[], titre) => {
          if (!titreActiviteTypeCheck(activiteType, titre)) return acc

          acc.push(
            ...titreActivitesBuild(
              activiteType,
              annees,
              aujourdhui,
              titre.id,
              titre.typeId,
              titre.demarches,
              titre.activites
            )
          )

          return acc
        }, [])
      )

      return acc
    },
    []
  )

  if (titresActivitesCreated.length) {
    await titresActivitesUpsert(titresActivitesCreated)

    const log = {
      type: 'titre / activités (création) ->',
      value: titresActivitesCreated.map(ta => ta.id).join(', ')
    }

    console.info(log.type, log.value)
  }

  return titresActivitesCreated.map(ta => ta.id)
}

export { titresActivitesUpdate }
