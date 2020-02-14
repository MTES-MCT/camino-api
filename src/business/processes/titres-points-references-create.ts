import { ITitresPoints, ITitresPointsReferences } from '../../types'

import PQueue from 'p-queue'

import { titrePointReferenceCreate } from '../../database/queries/titres-points'

const titreEtapePointsReferencesNewFind = (titrePoints: ITitresPoints[]) =>
  titrePoints.reduce((acc: ITitresPointsReferences[], titrePoint) => {
    if (!titrePoint.references || titrePoint.references.length === 0) {
      acc.push({
        id: `${titrePoint.id}-4326`,
        titrePointId: titrePoint.id,
        geoSystemeId: '4326',
        coordonnees: {
          x: titrePoint.coordonnees.x,
          y: titrePoint.coordonnees.y
        }
      })
    }

    return acc
  }, [])

const titresPointsReferencesCreate = async (titresPoints: ITitresPoints[]) => {
  const queue = new PQueue({ concurrency: 100 })

  const pointsReferencesNew = titreEtapePointsReferencesNewFind(titresPoints)
  const pointsReferencesCreated = pointsReferencesNew.map(r =>
    queue.add(async () => {
      await titrePointReferenceCreate(r)

      console.log(`création: référence du point ${JSON.stringify(r.id)}`)
    })
  )

  await queue.onIdle()

  return pointsReferencesCreated
}

export default titresPointsReferencesCreate
