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
]

const titresPropsEtapeIdsUpdate = async titres => {
  const titresUpdatedRequests = titres.reduce((acc, titre) => {
    const props = titrePropsEtapes.reduce((props, prop) => {
      const propEtapeIdName = `${prop}TitreEtapeId`
      const etapeId = titrePropEtapeIdFind(titre.demarches, prop)

      return etapeId !== titre[propEtapeIdName]
        ? { ...props, [propEtapeIdName]: etapeId }
        : props
    }, {})

    return Object.keys(props).length
      ? [
          ...acc,
          async () => {
            await titreUpdate(titre.id, props)
            console.log(
              `mise à jour: titre ${titre.id} props: ${JSON.stringify(props)}`
            )
          }
        ]
      : acc
  }, [])

  if (titresUpdatedRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresUpdatedRequests)
  }

  return `mise à jour: ${titresUpdatedRequests.length} titre(s) (propriétés-étapes)`
}

export { titrePropsEtapes }

export default titresPropsEtapeIdsUpdate
