import PQueue from 'p-queue'
import * as dateFormat from 'dateformat'

import {
  titreActiviteUpdate,
  titresActivitesGet
} from '../../database/queries/titres-activites'
import { titreActiviteStatutIdFind } from '../rules/titre-activite-statut-id-find'
import { userSuper } from '../../database/user-super'

// met à jour le statut des activités d'un titre
const titresActivitesStatutIdsUpdate = async () => {
  console.info()
  console.info('statut des activités…')
  const queue = new PQueue({
    concurrency: 100
  })

  const titresActivites = await titresActivitesGet({}, {}, userSuper)

  const aujourdhui = dateFormat(new Date(), 'yyyy-mm-dd')

  const titresActivitesUpdated = [] as string[]

  titresActivites.forEach(titreActivite => {
    const statutId = titreActiviteStatutIdFind(titreActivite, aujourdhui)

    if (titreActivite.statutId !== statutId) {
      queue.add(async () => {
        titreActivite.statutId = statutId

        await titreActiviteUpdate(titreActivite.id, { statutId }, {})

        const log = {
          type: 'titre / activité : statut (mise à jour) ->',
          value: `${titreActivite.id}: ${statutId}`
        }

        console.info(log.type, log.value)

        titresActivitesUpdated.push(titreActivite.id)
      })
    }
  })

  await queue.onIdle()

  return titresActivitesUpdated
}

export { titresActivitesStatutIdsUpdate }
