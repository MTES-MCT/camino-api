import { ITitreEtape, IGeoJson, IEtapeType } from '../../types'

import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from '../../tools/geojson'
import { etapeTypeSectionsFormat } from './etapes-types'
import { administrationFormat } from './administrations'
import { entrepriseFormat } from './entreprises'
import { titreEtapeFormatFields } from './_fields'

const titreEtapeFormat = (
  titreEtape: ITitreEtape,
  titreTypeId: string,
  demarcheTypeEtapesTypes: IEtapeType[],
  fields = titreEtapeFormatFields
) => {
  if (titreEtape.type) {
    titreEtape.type.sections = etapeTypeSectionsFormat(
      titreEtape.type,
      demarcheTypeEtapesTypes,
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
      titreEtape.geojsonPoints = (geojsonFeatureCollectionPoints(
        titreEtape.points
      ) as unknown) as IGeoJson
    }
  }

  if (!titreEtape.modification) {
    delete titreEtape.heritageProps
    delete titreEtape.heritageContenu
  }

  titreEtape.administrations = titreEtape.administrations?.map(
    administrationFormat
  )

  titreEtape.titulaires = titreEtape.titulaires?.map(entrepriseFormat)

  titreEtape.amodiataires = titreEtape.amodiataires?.map(entrepriseFormat)

  return titreEtape
}

export { titreEtapeFormatFields, titreEtapeFormat }
