import { ITitreDemarche } from '../../types'
import PQueue from 'p-queue'

import { titreDemarcheUpdate } from '../../database/queries/titres-demarches'
import { titresGet } from '../../database/queries/titres'
import titreDemarchesAscSort from '../utils/titre-elements-asc-sort'

const titresDemarchesOrdreUpdate = async (titresIds?: string[]) => {
  console.info('ordre des démarches…')

  const queue = new PQueue({ concurrency: 100 })

  const titres = await titresGet(
    { ids: titresIds },
    { fields: { demarches: { etapes: { id: {} } } } },
    'super'
  )

  const titresDemarchesIdsUpdated = [] as string[]

  titres.forEach(titre => {
    const titreDemarchesSorted = titreDemarchesAscSort(
      titre.demarches!.slice().reverse()
    )

    titreDemarchesSorted.forEach(
      (titreDemarche: ITitreDemarche, index: number) => {
        if (titreDemarche.ordre !== index + 1) {
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
        }
      }
    )
  })

  await queue.onIdle()

  return titresDemarchesIdsUpdated
}

export default titresDemarchesOrdreUpdate
