import { ITitre, ITitreProp, ITitreEtapeProp } from '../../types'
import PQueue from 'p-queue'

import { titresGet, titreUpdate } from '../../database/queries/titres'
import { titrePropEtapeIdFind } from '../rules/titre-prop-etape-id-find'

const titrePropsEtapes = [
  'points',
  'titulaires',
  'amodiataires',
  'administrations',
  'substances',
  'communes',
  'surface'
].map(prop => ({
  prop,
  name: `${prop}TitreEtapeId`
})) as {
  prop: ITitreEtapeProp
  name: ITitreProp
}[]

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
            substances: { id: {} },
            communes: { id: {} }
          }
        }
      }
    },
    'super'
  )

  const titresPropsEtapesIdsUpdated = [] as string[]

  titres.forEach(titre => {
    const propsEtapesIds = titrePropsEtapes.reduce(
      (propsEtapesIds: Partial<ITitre>, { prop, name }) => {
        const titreEtapeId = titrePropEtapeIdFind(
          prop,
          titre.demarches!,
          titre.statutId!
        )

        // si
        // - l'id de l'étape est différente de celle du titre
        // - l'id de l'étape existe ou elle existe dans le titre
        if (titreEtapeId !== titre[name] && (titre[name] || titreEtapeId)) {
          propsEtapesIds[name] = titreEtapeId
        }

        return propsEtapesIds
      },
      {}
    )

    if (Object.keys(propsEtapesIds).length) {
      queue.add(async () => {
        await titreUpdate(titre.id, propsEtapesIds)

        const log = {
          type: "titre : ids d'étapes des props (mise à jour) ->",
          value: `${titre.id} : ${JSON.stringify(propsEtapesIds)}`
        }

        console.info(log.type, log.value)

        titresPropsEtapesIdsUpdated.push(titre.id)
      })
    }
  })

  await queue.onIdle()

  return titresPropsEtapesIdsUpdated
}

export { titrePropsEtapes }

export default titresPropsEtapesIdsUpdate
