import { ITitreEtape } from '../../types'

import PQueue from 'p-queue'

import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import titreEtapesAscSortByDate from '../utils/titre-etapes-asc-sort-by-date'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'

const titresEtapesOrdreUpdate = async (titresDemarchesIds?: string[]) => {
  console.info('ordre des étapes…')
  const queue = new PQueue({ concurrency: 100 })

  const titresDemarches = await titresDemarchesGet(
    { titresDemarchesIds },
    {
      fields: {
        etapes: { id: {} },
        type: { etapesTypes: { id: {} } },
        titre: { id: {} }
      }
    },
    'super'
  )

  const titresEtapesIdsUpdated = [] as string[]

  titresDemarches.forEach(titreDemarche => {
    if (titreDemarche.etapes) {
      titreEtapesAscSortByDate(
        titreDemarche.etapes,
        titreDemarche.type,
        titreDemarche.titre?.typeId
      ).forEach((titreEtape: ITitreEtape, index: number) => {
        if (titreEtape.ordre !== index + 1) {
          queue.add(async () => {
            await titreEtapeUpdate(titreEtape.id, { ordre: index + 1 })

            console.info(
              `mise à jour: étape ${titreEtape.id}, ordre: ${index + 1}`
            )

            titresEtapesIdsUpdated.push(titreEtape.id)
          })
        }
      })
    }
  })

  await queue.onIdle()

  return titresEtapesIdsUpdated
}

export default titresEtapesOrdreUpdate
