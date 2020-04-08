import { ITitreActivite } from '../../types'

import PQueue from 'p-queue'

import { titreActiviteUpdate } from '../../database/queries/titres-activites'
import titreActiviteStatutIdFind from '../rules/titre-activite-statut-id-find'

// met à jour le statut des activités d'un titre
const titreActivitesStatutIdsUpdate = async (
  titresActivites: ITitreActivite[]
) => {
  const queue = new PQueue({
    concurrency: 100
  })

  const titresActivitesUpdated = titresActivites.reduce(
    (titresActivitesUpdated: string[], titreActivite) => {
      const statutId = titreActiviteStatutIdFind(titreActivite)

      if (titreActivite.statutId === statutId) {
        return titresActivitesUpdated
      }

      queue.add(async () => {
        titreActivite.statutId = statutId

        await titreActiviteUpdate(titreActivite.id, { statutId }, {})

        console.info(
          `mise à jour: activité ${titreActivite.id}, ${JSON.stringify({
            statutId
          })}`
        )

        titresActivitesUpdated.push(titreActivite.id)
      })

      return titresActivitesUpdated
    },
    []
  )

  await queue.onIdle()

  return titresActivitesUpdated
}

export default titreActivitesStatutIdsUpdate
