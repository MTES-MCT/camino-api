import { ITitre, ITitreEtapeIdPropId, IPropId } from '../../types'
import PQueue from 'p-queue'

import { titresGet, titreUpdate } from '../../database/queries/titres'
import { titrePropTitreEtapeFind } from '../rules/titre-prop-etape-find'

const titrePropsEtapes = [
  'points',
  'titulaires',
  'amodiataires',
  'administrations',
  'substances',
  'communes',
  'surface'
].map(propId => ({
  propId,
  titreEtapeIdPropId: `${propId}TitreEtapeId`
})) as {
  propId: IPropId
  titreEtapeIdPropId: ITitreEtapeIdPropId
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
    const propsTitreEtapesIds = titrePropsEtapes.reduce(
      (
        propsTitreEtapesIds: Partial<ITitre>,
        { propId, titreEtapeIdPropId }
      ) => {
        const titreEtape = titrePropTitreEtapeFind(
          propId,
          titre.demarches!,
          titre.statutId!
        )

        // si
        // - l'id de l'étape est différente de celle du titre
        // - l'id de l'étape existe ou elle existe dans le titre
        if (
          titreEtape &&
          titreEtape.id !== titre[titreEtapeIdPropId] &&
          (titre[titreEtapeIdPropId] || titreEtape.id)
        ) {
          propsTitreEtapesIds[titreEtapeIdPropId] = titreEtape.id
        }

        return propsTitreEtapesIds
      },
      {}
    )

    if (Object.keys(propsTitreEtapesIds).length) {
      queue.add(async () => {
        await titreUpdate(titre.id, propsTitreEtapesIds)

        const log = {
          type: "titre : ids d'étapes des props (mise à jour) ->",
          value: `${titre.id} : ${JSON.stringify(propsTitreEtapesIds)}`
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
