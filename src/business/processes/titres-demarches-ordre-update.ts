import { ITitre, ITitreDemarche } from '../../types'
import PQueue from 'p-queue'

import { titreDemarcheUpdate } from '../../database/queries/titres-demarches'
import titreDemarchesAscSort from '../utils/titre-elements-asc-sort'

const titresDemarchesOrdreUpdate = async (titres: ITitre[]) => {
  const queue = new PQueue({ concurrency: 100 })

  const titresDemarchesIdsUpdated = titres.reduce(
    (titresDemarchesIdsUpdated: string[], titre) =>
      (titreDemarchesAscSort(
        titre.demarches!.slice().reverse()
      ) as ITitreDemarche[]).reduce(
        (
          titresDemarchesIdsUpdated: string[],
          titreDemarche: ITitreDemarche,
          index: number
        ) => {
          if (titreDemarche.ordre === index + 1)
            return titresDemarchesIdsUpdated

          queue.add(async () => {
            await titreDemarcheUpdate(
              titreDemarche.id,
              { ordre: index + 1 },
              { fields: { id: {} } },
              'super',
              titre
            )

            console.info(
              `mise à jour: démarche ${titreDemarche.id}, ordre: ${index + 1}`
            )

            titresDemarchesIdsUpdated.push(titreDemarche.id)
          })

          return titresDemarchesIdsUpdated
        },
        titresDemarchesIdsUpdated
      ),
    []
  )

  await queue.onIdle()

  return titresDemarchesIdsUpdated
}

export default titresDemarchesOrdreUpdate
