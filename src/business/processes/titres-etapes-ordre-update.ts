import { ITitreDemarche, ITitreEtape } from '../../types'

import PQueue from 'p-queue'

import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import titreEtapesAscSortByDate from '../utils/titre-etapes-asc-sort-by-date'

const titresEtapesOrdreUpdate = async (titresDemarches: ITitreDemarche[]) => {
  const queue = new PQueue({ concurrency: 100 })

  const titresEtapesIdsUpdated = titresDemarches.reduce(
    (titresEtapesIdsUpdated: string[], titreDemarche) => {
      if (!titreDemarche.etapes) return titresEtapesIdsUpdated

      return titreEtapesAscSortByDate(
        titreDemarche.etapes,
        titreDemarche.type,
        titreDemarche.titre?.typeId
      ).reduce(
        (
          titresEtapesIdsUpdated: string[],
          titreEtape: ITitreEtape,
          index: number
        ) => {
          if (titreEtape.ordre === index + 1) return titresEtapesIdsUpdated

          queue.add(async () => {
            await titreEtapeUpdate(titreEtape.id, { ordre: index + 1 })

            console.info(
              `mise à jour: étape ${titreEtape.id}, ordre: ${index + 1}`
            )

            titresEtapesIdsUpdated.push(titreEtape.id)
          })

          return titresEtapesIdsUpdated
        },
        titresEtapesIdsUpdated
      )
    },
    []
  )

  await queue.onIdle()

  return titresEtapesIdsUpdated
}

export default titresEtapesOrdreUpdate
