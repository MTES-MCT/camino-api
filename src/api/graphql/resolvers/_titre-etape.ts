import {
  ITitrePoint,
  ITitrePointReference,
  ICoordonnees,
  IEtapeType,
  IHeritageProps,
  ITitreDemarche,
  ITitreEtape,
  IHeritageContenu,
  ISection
} from '../../../types'

import { geoConvert } from '../../../tools/geo-convert'
import { geoSystemes } from '../../../database/cache/geo-systemes'

import {
  titreEtapeHeritagePropsFind,
  titreEtapePropsIds
} from '../../../business/utils/titre-etape-heritage-props-find'
import {
  etapeSectionsDictionaryBuild,
  titreEtapeHeritageContenuFind
} from '../../../business/utils/titre-etape-heritage-contenu-find'
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

  const geoSysteme = geoSystemes.find(
    ({ id }) => pointReference.geoSystemeId === id
  )

  return geoSysteme && geoSysteme.unite && geoSysteme.unite.id === 'gon'
    ? 0.9
    : 1
}

const titreEtapeHeritagePropsBuild = (
  date: string,
  titreEtapes?: ITitreEtape[] | null
) => {
  const titreEtapesFiltered =
    titreEtapes?.filter(e => e.type?.fondamentale && e.date < date).reverse() ||
    []

  const heritageProps = titreEtapePropsIds.reduce((acc: IHeritageProps, id) => {
    acc[id] = { actif: !!titreEtapesFiltered.length }

    return acc
  }, {})

  const titreEtape = { date, heritageProps } as ITitreEtape

  titreEtapesFiltered.push(titreEtape)

  titreEtapesFiltered.forEach((te: ITitreEtape, index: number) => {
    const titreEtapePrecedente =
      index > 0 ? titreEtapesFiltered[index - 1] : null

    const { titreEtape } = titreEtapeHeritagePropsFind(te, titreEtapePrecedente)

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

  return newTitreEtape
}

const titreEtapeHeritageContenuBuild = (
  date: string,
  etapeType: IEtapeType,
  sections: ISection[],
  etapesTypes: IEtapeType[],
  titreTypeId: string,
  titreEtapes?: ITitreEtape[] | null
) => {
  if (!titreEtapes) {
    titreEtapes = []
  }
  const titreEtape = {
    id: 'new-titre-etape',
    date,
    type: etapeType,
    typeId: etapeType.id
  } as ITitreEtape

  let titreEtapesFiltered = titreEtapes.filter(te => te.date < date).reverse()

  titreEtapesFiltered.push(titreEtape)

  const etapeSectionsDictionary = etapeSectionsDictionaryBuild(
    titreEtapesFiltered,
    etapesTypes,
    titreTypeId
  )

  titreEtape.heritageContenu = sections.reduce(
    (heritageContenu: IHeritageContenu, section) => {
      if (!section.elements?.length) return heritageContenu

      heritageContenu[section.id] = section.elements?.reduce(
        (acc: IHeritageProps, element) => {
          acc[element.id] = {
            actif: !!titreEtapesFiltered.find(
              e =>
                e.id !== titreEtape.id &&
                etapeSectionsDictionary[e.id] &&
                etapeSectionsDictionary[e.id].find(
                  s =>
                    s.id === section.id &&
                    s.elements?.find(el => el.id === element.id)
                )
            )
          }

          return acc
        },
        {}
      )

      return heritageContenu
    },
    {}
  )

  titreEtapesFiltered = titreEtapesFiltered.filter(
    e => etapeSectionsDictionary[e.id]
  )

  const { contenu, heritageContenu } = titreEtapeHeritageContenuFind(
    titreEtapesFiltered,
    titreEtape,
    etapeSectionsDictionary
  )

  if (heritageContenu) {
    Object.keys(heritageContenu).forEach(sectionId => {
      Object.keys(heritageContenu![sectionId]).forEach(elementId => {
        const etapeId =
          heritageContenu &&
          heritageContenu[sectionId] &&
          heritageContenu[sectionId][elementId].etapeId

        if (etapeId) {
          heritageContenu![sectionId][
            elementId
          ].etape = titreEtapesFiltered.find(({ id }) => id === etapeId)
        }
      })
    })
  }

  return { contenu, heritageContenu }
}

const titreEtapeHeritageBuild = (
  date: string,
  etapeType: IEtapeType,
  titreDemarche: ITitreDemarche
) => {
  let titreEtape = {} as ITitreEtape

  if (etapeType.fondamentale) {
    titreEtape = titreEtapeHeritagePropsBuild(date, titreDemarche.etapes)
  }

  titreEtape.modification = true

  const sections = etapeTypeSectionsFormat(
    etapeType,
    titreDemarche.type!.etapesTypes!,
    titreDemarche.titre!.typeId
  )

  if (sections.length) {
    const { contenu, heritageContenu } = titreEtapeHeritageContenuBuild(
      date,
      etapeType,
      sections,
      titreDemarche.type!.etapesTypes,
      titreDemarche.titre!.typeId,
      titreDemarche.etapes
    )

    titreEtape.contenu = contenu
    titreEtape.heritageContenu = heritageContenu
  }

  titreEtape.type = etapeType

  return titreEtape
}

export { titreEtapeHeritageBuild, titreEtapePointsCalc }
