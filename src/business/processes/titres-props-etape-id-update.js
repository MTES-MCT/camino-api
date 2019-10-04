import PQueue from 'p-queue'

import { titreUpdate } from '../../database/queries/titres'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

const titrePropsEtapes = [
  'points',
  'titulaires',
  'amodiataires',
  'administrations',
  'surface',
  'volume',
  'volumeUniteId',
  'substances',
  'communes',
  'engagement',
  'engagementDeviseId'
].map(prop => ({ prop, propName: `${prop}TitreEtapeId` }))

const titresPropsEtapeIdsUpdate = async titres => {
  const queue = new PQueue({ concurrency: 100 })

  const titresUpdated = titres.reduce((titresUpdated, titre) => {
    const props = titrePropsEtapes.reduce((props, { prop, propName }) => {
      const value = titrePropEtapeIdFind(titre, prop)

      if (value !== titre[propName]) {
        props[propName] = value
      }

      return props
    }, {})

    if (Object.keys(props).length) {
      queue.add(async () => {
        const titreUpdated = await titreUpdate(titre.id, props)
        console.log(
          `mise à jour: titre ${titre.id} props: ${JSON.stringify(props)}`
        )

        titresUpdated.push(titreUpdated)
      })
    }

    return titresUpdated
  }, [])

  await queue.onIdle()

  return titresUpdated
}

export { titrePropsEtapes }

export default titresPropsEtapeIdsUpdate
