import {
  ITitrePoint,
  ITitrePointReference,
  ICoordonnees,
  IEtapeType,
  IHeritageProps,
  ITitreDemarche,
  ITitreEtape
} from '../../../types'

import geoConvert from '../../../tools/geo-convert'
import geo from '../../../database/cache/geo-systemes'

import {
  titreEtapeHeritagePropsFind,
  titreEtapePropsIds
} from '../../../business/utils/titre-etape-heritage-props-find'
import { etapeTypeSectionsFormat } from '../../_format/etapes-types'

const titreEtapePointsCalc = (titrePoints: ITitrePoint[]) => {
  const uniteRatio = uniteRatioFind(pointReferenceFind(titrePoints))

  return titrePoints.map(point => {
    const reference =
      point.references.find(r => r.opposable) || point.references[0]

    point.coordonnees = geoConvert(reference.geoSystemeId, {
      x: reference.coordonnees.x * uniteRatio,
      y: reference.coordonnees.y * uniteRatio
    }) as ICoordonnees

    return point
  })
}

const pointReferenceFind = (points: ITitrePoint[]) =>
  points.length &&
  points[0].references &&
  points[0].references.length &&
  (points[0].references.find(r => r.opposable) || points[0].references[0])

const uniteRatioFind = (pointReference: ITitrePointReference | 0) => {
  if (!pointReference || !pointReference.geoSystemeId) return 1

  const geoSysteme = geo.systemes.find(
    ({ id }) => pointReference.geoSystemeId === id
  )

  return geoSysteme && geoSysteme.unite && geoSysteme.unite.id === 'gon'
    ? 0.9
    : 1
}

const titreEtapeBuild = (
  date: string,
  etapeType: IEtapeType,
  titreDemarche: ITitreDemarche
) => {
  const newTitreEtape = {} as ITitreEtape

  if (etapeType.fondamentale) {
    const titreEtapesFiltered =
      titreDemarche.etapes
        ?.filter(e => e.type?.fondamentale && e.date < date)
        .reverse() || []

    const heritageProps = titreEtapePropsIds.reduce(
      (acc: IHeritageProps, id) => {
        acc[id] = { actif: !!titreEtapesFiltered.length }

        return acc
      },
      {}
    )

    const titreEtape = { date, heritageProps } as ITitreEtape

    titreEtapesFiltered.push(titreEtape)

    titreEtapesFiltered.forEach((te: ITitreEtape, index: number) => {
      const titreEtapePrecedente =
        index > 0 ? titreEtapesFiltered[index - 1] : null

      const { titreEtape } = titreEtapeHeritagePropsFind(
        te,
        titreEtapePrecedente
      )

      titreEtapesFiltered[index] = titreEtape
    })

    const newTitreEtape = titreEtapesFiltered[titreEtapesFiltered.length - 1]

    if (newTitreEtape.heritageProps) {
      Object.keys(newTitreEtape.heritageProps).forEach(id => {
        const etapeId =
          newTitreEtape.heritageProps && newTitreEtape.heritageProps[id].etapeId

        if (etapeId) {
          newTitreEtape.heritageProps![id].etape = titreEtapesFiltered.find(
            ({ id }) => id === etapeId
          )
        }
      })
    }
  }

  const sections = etapeTypeSectionsFormat(
    etapeType,
    titreDemarche.type!.etapesTypes!,
    titreDemarche.titre!.typeId
  )

  if (Object.keys(sections).length) {
    // trouver le contenu
    newTitreEtape.contenu = {}

    newTitreEtape.heritageContenu = {}
  }

  return newTitreEtape
}

export { titreEtapeBuild, titreEtapePointsCalc }
