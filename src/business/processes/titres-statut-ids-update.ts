import PQueue from 'p-queue'
import * as dateFormat from 'dateformat'

import { titresGet, titreUpdate } from '../../database/queries/titres'
import { titreStatutIdFind } from '../rules/titre-statut-id-find'

const titresStatutIdsUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('statut des titres…')
  const queue = new PQueue({ concurrency: 100 })

  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        demarches: { phase: { id: {} }, etapes: { points: { id: {} } } }
      }
    },
    'super'
  )

  const titresUpdated = [] as string[]
  const aujourdhui = dateFormat(new Date(), 'yyyy-mm-dd')

  titres.forEach(titre => {
    const statutId = titreStatutIdFind(aujourdhui, titre.demarches)

    if (statutId !== titre.statutId) {
      queue.add(async () => {
        await titreUpdate(titre.id, { statutId })

        const log = {
          type: 'titre : statut (mise à jour) ->',
          value: `${titre.id} : ${statutId}`
        }

        console.info(log.type, log.value)

        titresUpdated.push(titre.id)
      })
    }
  })

  await queue.onIdle()

  return titresUpdated
}

export default titresStatutIdsUpdate
