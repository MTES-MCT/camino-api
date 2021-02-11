import { ITitreEtape, IDemarcheType, IGeoJson, IFields } from '../../types'

import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from '../../tools/geojson'
import { etapeTypeSectionsFormat } from './etapes-types'
import { administrationFormat } from './administrations'
import { entrepriseFormat } from './entreprises'

const titreEtapeFormatFields = {
  geojsonMultiPolygon: {},
  geojsonPoints: {},
  pays: {},
  sections: {}
} as IFields

const titreEtapeFormat = (
  titreEtape: ITitreEtape,
  titreTypeId: string,
  titreDemarcheType: IDemarcheType,
  fields = titreEtapeFormatFields
) => {
  if (titreEtape.type) {
    titreEtape.type.sections = etapeTypeSectionsFormat(
      titreEtape.type,
      titreDemarcheType.etapesTypes,
      titreTypeId
    )
  }

  if (!fields) return titreEtape

  if (titreEtape.points && titreEtape.points.length) {
    if (fields.geojsonMultiPolygon) {
      titreEtape.geojsonMultiPolygon = geojsonFeatureMultiPolygon(
        titreEtape.points
      ) as IGeoJson
    }

    if (fields.geojsonPoints) {
      titreEtape.geojsonPoints = geojsonFeatureCollectionPoints(
        titreEtape.points
      ) as IGeoJson
    }
  }

  titreEtape.administrations = titreEtape.administrations?.map(
    administrationFormat
  )

  titreEtape.titulaires = titreEtape.titulaires?.map(entrepriseFormat)

  titreEtape.amodiataires = titreEtape.amodiataires?.map(entrepriseFormat)

  return titreEtape
}

export { titreEtapeFormatFields, titreEtapeFormat }
