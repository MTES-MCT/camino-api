import PQueue from 'p-queue'

import { titrePointReferenceCreate } from '../../database/queries/titres-points'

const titreEtapePointsReferencesNewFind = titrePoints =>
  titrePoints.reduce((acc, titrePoint) => {
    if (!titrePoint.references || titrePoint.references.length === 0) {
      acc.push({
        id: `${titrePoint.id}-4326`,
        titrePointId: titrePoint.id,
        geoSystemeId: '4326',
        coordonnees: {
          x: titrePoint.coordonnees.x.toString(),
          y: titrePoint.coordonnees.y.toString()
        }
      })
    }

    return acc
  }, [])

const titreDemarchePointsReferencesNewFind = titreEtapes =>
  titreEtapes.reduce(
    (acc, titreEtape) =>
      titreEtape.points && titreEtape.points.length
        ? acc.concat(titreEtapePointsReferencesNewFind(titreEtape.points))
        : acc,
    []
  )

const titrePointsReferencesNewFind = titreDemarches =>
  titreDemarches.reduce(
    (acc, titreDemarche) =>
      titreDemarche.etapes && titreDemarche.etapes.length
        ? acc.concat(titreDemarchePointsReferencesNewFind(titreDemarche.etapes))
        : acc,
    []
  )

const titresPointsReferencesNewFind = titres =>
  titres.reduce(
    (acc, titre) =>
      titre.demarches && titre.demarches.length
        ? acc.concat(titrePointsReferencesNewFind(titre.demarches))
        : acc,
    []
  )

const titresPointsReferencesCreate = async titres => {
  const pointsReferencesNew = titresPointsReferencesNewFind(titres)
  const pointsReferencesCreated = pointsReferencesNew.map(r => async () => {
    await titrePointReferenceCreate(r)

    console.log(`création: référence du point ${JSON.stringify(r.id)}`)
  })

  if (pointsReferencesCreated.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(pointsReferencesCreated)
  }

  return `création: ${pointsReferencesCreated.length} référence(s) de points`
}

export default titresPointsReferencesCreate
