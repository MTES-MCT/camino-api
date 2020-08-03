import { ITitreTravaux, ITitreEtape } from '../../types'

import PQueue from 'p-queue'

import { titreTravauxEtapeUpdate } from '../../database/queries/titres-travaux-etapes'
import titreEtapesAscSortByDate from '../utils/titre-etapes-asc-sort-by-date'

const titresTravauxEtapesOrdreUpdate = async (
  titresTravaux: ITitreTravaux[]
) => {
  const queue = new PQueue({ concurrency: 100 })

  const titresTravauxEtapesIdsUpdated = titresTravaux.reduce(
    (titresTravauxEtapesIdsUpdated: string[], titreTravau) => {
      if (!titreTravau.etapes) return titresTravauxEtapesIdsUpdated

      return titreEtapesAscSortByDate(
        titreTravau.etapes,
        titreTravau.type,
        titreTravau.titre?.typeId
      ).reduce(
        (
          titresTravauxEtapesIdsUpdated: string[],
          titreEtape: ITitreEtape,
          index: number
        ) => {
          if (titreEtape.ordre === index + 1)
            return titresTravauxEtapesIdsUpdated

          queue.add(async () => {
            await titreTravauxEtapeUpdate(titreEtape.id, { ordre: index + 1 })

            console.info(
              `mise à jour: étape de travaux ${titreEtape.id}, ordre: ${
                index + 1
              }`
            )

            titresTravauxEtapesIdsUpdated.push(titreEtape.id)
          })

          return titresTravauxEtapesIdsUpdated
        },
        titresTravauxEtapesIdsUpdated
      )
    },
    []
  )

  await queue.onIdle()

  return titresTravauxEtapesIdsUpdated
}

export default titresTravauxEtapesOrdreUpdate
