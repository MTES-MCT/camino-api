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
  const titresToUpdate = titres.reduce((acc, titre) => {
    const props = titrePropsEtapes.reduce((props, prop) => {
      const propEtapeIdName = `${prop}TitreEtapeId`
      const etapeId = titrePropEtapeIdFind(titre.demarches, prop)

      if (etapeId !== titre[propEtapeIdName]) {
        props[propEtapeIdName] = etapeId
      }

      return props
    }, {})

    if (Object.keys(props).length) {
      acc.push({ id: titre.id, ...props })
    }

    return acc
  }, [])

  if (!titresToUpdate.length) {
    return []
  }

  const titresUpdated = titresToUpdate.map(({ id, ...props }) => async () => {
    const titreUpdated = await titreUpdate(id, props)
    console.log(`mise à jour: titre ${id} props: ${JSON.stringify(props)}`)

    return titreUpdated
  })

  const queue = new PQueue({ concurrency: 100 })

  return queue.addAll(titresUpdated)
}

export { titrePropsEtapes }

export default titresPropsEtapeIdsUpdate
