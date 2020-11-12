import { ITitreTravaux } from '../../types'
import PQueue from 'p-queue'

import { titreTravauxUpdate } from '../../database/queries/titres-travaux'
import titreTravauxAscSort from '../utils/titre-elements-asc-sort'
import { titresGet } from '../../database/queries/titres'

const titresTravauxOrdreUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info(`ordre des travaux…`)
  const queue = new PQueue({ concurrency: 100 })

  const titres = await titresGet(
    { ids: titresIds },
    { fields: { travaux: { etapes: { id: {} } } } },
    'super'
  )

  const titresTravauxIdsUpdated = [] as string[]

  titres.forEach(titre => {
    if (titre.travaux) {
      const titreTravauxSorted = titreTravauxAscSort(
        titre.travaux.slice().reverse()
      ) as ITitreTravaux[]

      titreTravauxSorted.forEach(
        (titreTravaux: ITitreTravaux, index: number) => {
          if (titreTravaux.ordre !== index + 1) {
            queue.add(async () => {
              await titreTravauxUpdate(
                titreTravaux.id,
                { ordre: index + 1 },
                { fields: { id: {} } }
              )

              const log = {
                type: 'titre / travaux : ordre (mise à jour) ->',
                value: `${titreTravaux.id} : ${index + 1}`
              }

              console.info(log.type, log.value)

              titresTravauxIdsUpdated.push(titreTravaux.id)
            })
          }
        }
      )
    }
  })

  await queue.onIdle()

  return titresTravauxIdsUpdated
}

export default titresTravauxOrdreUpdate
