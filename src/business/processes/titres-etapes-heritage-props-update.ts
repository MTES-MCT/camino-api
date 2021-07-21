import PQueue from 'p-queue'

import { ITitreEtape } from '../../types'

import { titreEtapeUpdate } from '../../database/queries/titres-etapes'
import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { titreEtapeHeritagePropsFind } from '../utils/titre-etape-heritage-props-find'
import { userSuper } from '../../database/user-super'

const titresEtapesHeritagePropsUpdate = async (
  titresDemarchesIds?: string[]
) => {
  console.info()
  console.info('héritage des propriétés des étapes…')
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
          points: { references: { id: {} } }
        }
      }
    },
    userSuper
  )

  // lorsqu'une étape est mise à jour par un utilisateur,
  // l'objet heritageProps reçu ne contient pas d'id d'étape
  // l'étape est donc toujours mise à jour

  const titresEtapesIdsUpdated = [] as string[]

  titresDemarches.forEach(titreDemarche => {
    const titreEtapes = titreDemarche.etapes
      ?.reverse()
      .filter(e => e.type!.fondamentale)

    if (titreEtapes) {
      titreEtapes.forEach((titreEtape: ITitreEtape, index: number) => {
        const titreEtapePrecedente = index > 0 ? titreEtapes[index - 1] : null

        const { hasChanged, titreEtapeUpdated, partialTitreEtape } =
          titreEtapeHeritagePropsFind(titreEtape, titreEtapePrecedente)

        if (hasChanged) {
          queue.add(async () => {
            await titreEtapeUpdate(titreEtape.id, partialTitreEtape, userSuper)

            const log = {
              type: 'titre / démarche / étape : héritage des propriétés (mise à jour) ->',
              value: `${titreEtape.id}`
            }

            console.info(log.type, log.value)

            titresEtapesIdsUpdated.push(titreEtape.id)
          })

          // met à jour l'étape pour l'itération suivante
          titreEtapes[index] = titreEtapeUpdated
        }
      })
    }
  })

  await queue.onIdle()

  return titresEtapesIdsUpdated
}

export { titresEtapesHeritagePropsUpdate }
