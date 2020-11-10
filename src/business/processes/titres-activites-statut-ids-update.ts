import PQueue from 'p-queue'

import {
  titreActiviteUpdate,
  titresActivitesGet
} from '../../database/queries/titres-activites'
import titreActiviteStatutIdFind from '../rules/titre-activite-statut-id-find'

// met à jour le statut des activités d'un titre
const titreActivitesStatutIdsUpdate = async () => {
  console.info('statut des activités dont le délai est dépassé')
  const queue = new PQueue({
    concurrency: 100
  })

  const titresActivites = await titresActivitesGet({}, {}, 'super')

  const titresActivitesUpdated = [] as string[]

  titresActivites.forEach(titreActivite => {
    const statutId = titreActiviteStatutIdFind(titreActivite)

    if (titreActivite.statutId !== statutId) {
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
    }
  })

  await queue.onIdle()

  return titresActivitesUpdated
}

export default titreActivitesStatutIdsUpdate
