import { ITitre } from '../../types'
import PQueue from 'p-queue'

import { titreUpdate } from '../../database/queries/titres'
import titreStatutIdFind from '../rules/titre-statut-id-find'

const titresStatutIdsUpdate = async (titres: ITitre[]) => {
  const queue = new PQueue({ concurrency: 100 })

  const titresUpdated = titres.reduce((titresUpdated: string[], titre) => {
    const statutId = titreStatutIdFind(titre)

    if (statutId !== titre.statutId) {
      queue.add(async () => {
        await titreUpdate(titre.id, { statutId })

        console.log(
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
