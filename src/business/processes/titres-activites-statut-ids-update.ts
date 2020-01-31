import { ITitresActivites } from '../../types'

import PQueue from 'p-queue'

import { titreActiviteUpdate } from '../../database/queries/titres-activites'
import titreActiviteStatutIdFind from '../rules/titre-activite-statut-id-find'

// met à jour le statut des activités d'un titre
const titreActivitesStatutIdsUpdate = async (
  titresActivites: ITitresActivites[]
) => {
  const queue = new PQueue({
    concurrency: 100
  })

  const titresActivitesUpdated = titresActivites.reduce(
    (titresActivitesUpdated: string[], titreActivite) => {
      const activiteStatutId = titreActiviteStatutIdFind(titreActivite)

      if (titreActivite.activiteStatutId === activiteStatutId) {
        return titresActivitesUpdated
      }

      queue.add(async () => {
        titreActivite.activiteStatutId = activiteStatutId

        await titreActiviteUpdate(titreActivite.id, { activiteStatutId })

        console.log(
          `mise à jour: activité ${titreActivite.id}, ${JSON.stringify({
            activiteStatutId
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
