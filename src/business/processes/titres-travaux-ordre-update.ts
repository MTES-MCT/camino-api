import { ITitreTravaux } from '../../types'
import PQueue from 'p-queue'

import { titreTravauxUpdate } from '../../database/queries/titres-travaux'
import titreTravauxAscSort from '../utils/titre-elements-asc-sort'
import { titresGet } from '../../database/queries/titres'

const titresTravauxOrdreUpdate = async (titresIds?: string[]) => {
  console.info(`ordre des travaux…`)
  const queue = new PQueue({ concurrency: 100 })

  const titres = await titresGet(
    { ids: titresIds },
    { fields: { travaux: { etapes: { id: {} } } } },
    'super'
  )

  const titresTravauxIdsUpdated = titres.reduce(
    (titresTravauxIdsUpdated: string[], titre) => {
      if (!titre.travaux) return titresTravauxIdsUpdated

      const titreTravauxSorted = titreTravauxAscSort(
        titre.travaux.slice().reverse()
      ) as ITitreTravaux[]

      return titreTravauxSorted.reduce(
        (
          titresTravauxIdsUpdated: string[],
          titreTravaux: ITitreTravaux,
          index: number
        ) => {
          if (titreTravaux.ordre === index + 1) return titresTravauxIdsUpdated

          queue.add(async () => {
            await titreTravauxUpdate(
              titreTravaux.id,
              { ordre: index + 1 },
              { fields: { id: {} } }
            )

            console.info(
              `mise à jour: travaux ${titreTravaux.id}, ordre: ${index + 1}`
            )

            titresTravauxIdsUpdated.push(titreTravaux.id)
          })

          return titresTravauxIdsUpdated
        },
        titresTravauxIdsUpdated
      )
    },
    []
  )

  await queue.onIdle()

  return titresTravauxIdsUpdated
}

export default titresTravauxOrdreUpdate
