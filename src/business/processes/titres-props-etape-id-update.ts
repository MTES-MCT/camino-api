import { ITitre, TitreProp, TitreEtapeProp } from '../../types'
import PQueue from 'p-queue'

import { titresGet, titreUpdate } from '../../database/queries/titres'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

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
  prop: TitreEtapeProp
  name: TitreProp
}[]

const titresPropsEtapeIdsUpdate = async (titresIds?: string[]) => {
  console.info()
  console.info('propriétés des titres (liens vers les étapes)…')
  const queue = new PQueue({ concurrency: 100 })

  const titres = await titresGet(
    { ids: titresIds },
    {
      fields: {
        demarches: {
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

  const titresIdsUpdated = [] as string[]

  titres.forEach(titre => {
    const props = titrePropsEtapes.reduce(
      (props: Partial<ITitre>, { prop, name }) => {
        const value = titrePropEtapeIdFind(
          titre.demarches!,
          titre.statutId!,
          prop
        )

        // si
        // - la valeur de la prop est différente de celle du titre
        // - la valeur existe ou elle existe dans le titre
        if (value !== titre[name] && (titre[name] || value)) {
          props[name] = value
        }

        return props
      },
      {}
    )

    if (Object.keys(props).length) {
      queue.add(async () => {
        await titreUpdate(titre.id, props)

        const log = {
          type: 'titre : props-etape (mise à jour) ->',
          value: `${titre.id} : ${JSON.stringify(props)}`
        }

        console.info(log.type, log.value)

        titresIdsUpdated.push(titre.id)
      })
    }
  })

  await queue.onIdle()

  return titresIdsUpdated
}

export { titrePropsEtapes }

export default titresPropsEtapeIdsUpdate
