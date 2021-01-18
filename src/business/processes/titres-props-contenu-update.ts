import PQueue from 'p-queue'

import { titresGet, titreUpdate } from '../../database/queries/titres'
import { propsTitreEtapesIdsFind } from '../utils/props-titre-etapes-ids-find'
import { objectsDiffer } from '../../tools/index'

const titresPropsContenuUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info(`propriétés des titres (liens vers les contenus d'étapes)…`)
  const queue = new PQueue({ concurrency: 100 })

  const titres = await titresGet(
    { ids: titresIds },
    { fields: { type: { id: {} }, demarches: { etapes: { id: {} } } } },
    'super'
  )

  const titresUpdated = titres.reduce((titresIdsUpdated: string[], titre) => {
    const propsTitreEtapesIds = propsTitreEtapesIdsFind(
      titre.statutId!,
      titre.demarches!,
      titre.type!.propsEtapesTypes
    )

    // si une prop du titre est mise à jour
    const hasChanged =
      (!titre.propsTitreEtapesIds && propsTitreEtapesIds) ||
      (titre.propsTitreEtapesIds && !propsTitreEtapesIds) ||
      (titre.propsTitreEtapesIds &&
        propsTitreEtapesIds &&
        objectsDiffer(titre.propsTitreEtapesIds, propsTitreEtapesIds))

    if (hasChanged) {
      queue.add(async () => {
        await titreUpdate(titre.id, {
          propsTitreEtapesIds
        })

        const log = {
          type: 'titre : props-contenu-etape (mise à jour) ->',
          value: `${titre.id} : ${JSON.stringify(propsTitreEtapesIds)}`
        }

        console.info(log.type, log.value)

        titresIdsUpdated.push(titre.id)
      })
    }

    return titresIdsUpdated
  }, [])

  await queue.onIdle()

  return titresUpdated
}

export { titresPropsContenuUpdate, propsTitreEtapesIdsFind }
