import { ITitreEtape } from '../../types'

import PQueue from 'p-queue'

import { titreEtapeUpsert } from '../../database/queries/titres-etapes'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { titreEtapePropsHeritageFind } from '../utils/titre-etape-props-heritage-find'

const titresEtapesHeritageUpdate = async (titresDemarchesIds?: string[]) => {
  console.info()
  console.info('héritage des étapes…')
  const queue = new PQueue({ concurrency: 100 })

  const titresDemarches = await titresDemarchesGet(
    { titresDemarchesIds },
    {
      fields: {
        etapes: {
          type: { id: {} },
          titulaires: { id: {} },
          amodiataires: { id: {} },
          substances: { id: {} },
          points: { id: {} }
        }
      }
    },
    'super'
  )

  const titresEtapesIdsUpdated = [] as string[]

  titresDemarches.forEach(titreDemarche => {
    const titreEtapes = titreDemarche.etapes
      ?.reverse()
      .filter(e => e.type!.fondamentale)

    if (titreEtapes) {
      titreEtapes.forEach((titreEtape: ITitreEtape, index: number) => {
        const titreEtapePrecedente =
          index > 0 ? titreEtapes[index - 1] : undefined
        const {
          hasChanged,
          titreEtape: newTitreEtape
        } = titreEtapePropsHeritageFind(titreEtape, titreEtapePrecedente)

        if (hasChanged) {
          queue.add(async () => {
            await titreEtapeUpsert(newTitreEtape)

            const log = {
              type: 'titre / démarche / étape : héritage (mise à jour) ->',
              value: `${titreEtape.id}`
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

export { titresEtapesHeritageUpdate }
