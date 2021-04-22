import PQueue from 'p-queue'

import { ITitreEtape } from '../../types'

import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import titreEtapesSortAscByDate from '../utils/titre-etapes-sort-asc-by-date'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { userSuper } from '../../database/user-super'

const titresEtapesOrdreUpdate = async (titresDemarchesIds?: string[]) => {
  console.info()
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
    userSuper
  )

  const titresEtapesIdsUpdated = [] as string[]

  titresDemarches.forEach(titreDemarche => {
    if (titreDemarche.etapes) {
      titreEtapesSortAscByDate(
        titreDemarche.etapes,
        'demarches',
        titreDemarche.type,
        titreDemarche.titre?.typeId
      ).forEach((titreEtape: ITitreEtape, index: number) => {
        if (titreEtape.ordre !== index + 1) {
          queue.add(async () => {
            await titreEtapeUpdate(titreEtape.id, { ordre: index + 1 })

            const log = {
              type: 'titre / démarche / étape : ordre (mise à jour) ->',
              value: `${titreEtape.id} : ${index + 1}`
            }

            console.info(log.type, log.value)

            titresEtapesIdsUpdated.push(titreEtape.id)
          })
        }
      })
    }
  })

  await queue.onIdle()

  return titresEtapesIdsUpdated
}

export { titresEtapesOrdreUpdate }
