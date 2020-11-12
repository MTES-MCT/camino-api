import { ITitreEtape } from '../../types'

import PQueue from 'p-queue'

import { titreTravauxEtapeUpdate } from '../../database/queries/titres-travaux-etapes'
import titreEtapesAscSortByDate from '../utils/titre-etapes-asc-sort-by-date'
import { titresTravauxGet } from '../../database/queries/titres-travaux'

const titresTravauxEtapesOrdreUpdate = async (titresTravauxIds?: string[]) => {
  console.info()
  console.info('ordre des étapes de travaux…')
  const queue = new PQueue({ concurrency: 100 })

  const titresTravaux = await titresTravauxGet(
    { titresTravauxIds },
    {
      fields: {
        etapes: { id: {} },
        type: { etapesTypes: { id: {} } },
        titre: { id: {} }
      }
    }
  )

  const titresTravauxEtapesIdsUpdated = [] as string[]

  titresTravaux.forEach(titreTravau => {
    if (titreTravau.etapes) {
      const titreTravauxEtapeSorted = titreEtapesAscSortByDate(
        titreTravau.etapes,
        titreTravau.type,
        titreTravau.titre?.typeId
      )

      titreTravauxEtapeSorted.forEach(
        (titreEtape: ITitreEtape, index: number) => {
          if (titreEtape.ordre !== index + 1) {
            queue.add(async () => {
              await titreTravauxEtapeUpdate(titreEtape.id, { ordre: index + 1 })

              const log = {
                type: 'titre / travaux / étape : ordre (mise à jour) ->',
                value: `${titreEtape.id} : ${index + 1}`
              }

              console.info(log.type, log.value)

              titresTravauxEtapesIdsUpdated.push(titreEtape.id)
            })
          }
        }
      )
    }
  })

  await queue.onIdle()

  return titresTravauxEtapesIdsUpdated
}

export default titresTravauxEtapesOrdreUpdate
