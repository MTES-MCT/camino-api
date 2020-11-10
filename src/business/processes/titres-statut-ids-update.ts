import PQueue from 'p-queue'

import { titresGet, titreUpdate } from '../../database/queries/titres'
import titreStatutIdFind from '../rules/titre-statut-id-find'

const titresStatutIdsUpdate = async (titresIds?: string[]) => {
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

  const titresUpdated = titres.reduce((titresUpdated: string[], titre) => {
    const statutId = titreStatutIdFind(titre)

    if (statutId !== titre.statutId) {
      queue.add(async () => {
        await titreUpdate(titre.id, { statutId })

        console.info(
          `mise à jour: titre ${titre.id} props: ${JSON.stringify({
            statutId
          })}`
        )

        titresUpdated.push(titre.id)
      })
    }

    return titresUpdated
  }, [])

  await queue.onIdle()

  return titresUpdated
}

export default titresStatutIdsUpdate
