import { ITitres } from '../../types'
import PQueue from 'p-queue'

import { titreUpdate } from '../../database/queries/titres'
import titrePropEtapeIdFind from '../rules/titre-prop-etape-id-find'

interface ITitresIndex extends ITitres {
  [key: string]: any
}
interface IAnyIndex {
  [key: string]: any
}

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
].map(prop => ({ prop, name: `${prop}TitreEtapeId` }))

const titresPropsEtapeIdsUpdate = async (titres: ITitres[]) => {
  const queue = new PQueue({ concurrency: 100 })

  const titresUpdated = titres.reduce(
    (titresUpdated: ITitres[], titre: ITitresIndex) => {
      const props = titrePropsEtapes.reduce(
        (props: IAnyIndex, { prop, name }) => {
          const value = titrePropEtapeIdFind(
            { demarches: titre.demarches!, statutId: titre.statutId! },
            prop
          )

          if (value !== titre[name]) {
            props[name] = value
          }

          return props
        },
        {}
      )

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
    },
    []
  )

  await queue.onIdle()

  return titresUpdated
}

export { titrePropsEtapes }

export default titresPropsEtapeIdsUpdate
