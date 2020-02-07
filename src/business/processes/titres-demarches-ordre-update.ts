import { ITitres, ITitresDemarches } from '../../types'

import PQueue from 'p-queue'

import { titreDemarcheUpdate } from '../../database/queries/titres-demarches'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'

const titresDemarchesOrdreUpdate = async (titres: ITitres[]) => {
  const queue = new PQueue({ concurrency: 100 })

  const titresDemarchesUpdated = titres.reduce(
    (titresDemarchesUpdated: string[], titre: ITitres) => {
      if (!titre.demarches) {
        return titresDemarchesUpdated
      }

      return titreDemarchesAscSort(titre.demarches.slice().reverse()).reduce(
        (
          titresDemarchesUpdated: string[],
          titreDemarche: ITitresDemarches,
          index: number
        ) => {
          if (titreDemarche.ordre === index + 1) return titresDemarchesUpdated

          queue.add(async () => {
            await titreDemarcheUpdate(titreDemarche.id, { ordre: index + 1 })

            console.log(
              `mise à jour: démarche ${titreDemarche.id}, ${JSON.stringify({
                ordre: index + 1
              })}`
            )

            titresDemarchesUpdated.push(titreDemarche.id)
          })

          return titresDemarchesUpdated
        },
        titresDemarchesUpdated
      )
    },
    []
  )

  await queue.onIdle()

  return titresDemarchesUpdated
}

export default titresDemarchesOrdreUpdate
