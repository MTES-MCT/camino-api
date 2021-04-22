import { IPropId, IPropsTitreEtapesIds } from '../../types'
import PQueue from 'p-queue'

import { titresGet, titreUpdate } from '../../database/queries/titres'
import { titrePropTitreEtapeFind } from '../rules/titre-prop-etape-find'
import { objectsDiffer } from '../../tools/index'
import { userSuper } from '../../database/user-super'

const titrePropsEtapes = [
  'points',
  'titulaires',
  'amodiataires',
  'administrations',
  'substances',
  'surface'
] as IPropId[]

const titresPropsEtapesIdsUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('propriétés des titres (liens vers les étapes)…')
  const queue = new PQueue({ concurrency: 100 })

  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        demarches: {
          phase: { id: {} },
          etapes: {
            points: { id: {} },
            titulaires: { id: {} },
            amodiataires: { id: {} },
            administrations: { id: {} },
            substances: { id: {} }
          }
        }
      }
    },
    userSuper
  )

  const titresPropsEtapesIdsUpdated = [] as string[]

  titres.forEach(titre => {
    const propsTitreEtapesIds = titrePropsEtapes.reduce(
      (propsTitreEtapesIds: IPropsTitreEtapesIds, propId) => {
        const titreEtape = titrePropTitreEtapeFind(
          propId,
          titre.demarches!,
          titre.statutId!
        )

        if (titreEtape) {
          propsTitreEtapesIds[propId] = titreEtape.id
        }

        return propsTitreEtapesIds
      },
      {}
    )

    if (objectsDiffer(propsTitreEtapesIds, titre.propsTitreEtapesIds)) {
      queue.add(async () => {
        await titreUpdate(titre.id, { propsTitreEtapesIds })

        const log = {
          type: "titre : ids d'étapes des props (mise à jour) ->",
          value: `${titre.id} : ${JSON.stringify(
            propsTitreEtapesIds
          )} | ${JSON.stringify(titre.propsTitreEtapesIds)}`
        }

        console.info(log.type, log.value)

        titresPropsEtapesIdsUpdated.push(titre.id)
      })
    }
  })

  await queue.onIdle()

  return titresPropsEtapesIdsUpdated
}

export { titrePropsEtapes, titresPropsEtapesIdsUpdate }
