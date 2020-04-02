import {
  ITitreEtape,
  IDemarcheType,
  IGeoJson,
  IUtilisateur,
  IFields
} from '../../../types'

import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from '../../../tools/geojson'
import { titreSectionsFormat } from './titres-sections'
import { etapesTypesFormat } from './etapes-types'
import { administrationFormat } from './administrations'
import { entrepriseFormat } from './entreprises'

const titreEtapeFormatFields = {
  geojsonMultiPolygon: {},
  geojsonPoints: {},
  pays: {},
  sections: {}
} as IFields

const titreEtapeFormat = (
  user: IUtilisateur | undefined,
  titreEtape: ITitreEtape,
  titreTypeId: string,
  titreDemarcheType: IDemarcheType,
  fields = titreEtapeFormatFields
) => {
  if (titreEtape.type) {
    const etapeType = titreDemarcheType.etapesTypes.find(
      et => et.id === titreEtape.type!.id
    )
    if (!etapeType) {
      throw new Error(
        `« ${titreEtape.type.nom} » inexistant pour une démarche « ${titreDemarcheType.nom} » pour un titre « ${titreTypeId} »`
      )
    }

    // crée une copie du type d'étape pour ne pas modifier le cache applicatif
    titreEtape.type = JSON.parse(JSON.stringify(etapeType))

    titreEtape.type!.editable = titreEtape.editable

    titreEtape.type = etapesTypesFormat(titreEtape.type!)

    if (titreEtape.type.sections) {
      titreEtape.type.sections = titreSectionsFormat(titreEtape.type.sections)
    }
  }

  if (!fields) return titreEtape

  if (titreEtape.points && titreEtape.points.length) {
    if (fields.geojsonMultiPolygon) {
      titreEtape.geojsonMultiPolygon = (geojsonFeatureMultiPolygon(
        titreEtape.points
      ) as unknown) as IGeoJson
    }

    if (fields.geojsonPoints) {
      titreEtape.geojsonPoints = (geojsonFeatureCollectionPoints(
        titreEtape.points
      ) as unknown) as IGeoJson
    }
  }

  titreEtape.administrations = titreEtape.administrations?.map(a =>
    administrationFormat(user, a)
  )

  titreEtape.titulaires = titreEtape.titulaires?.map(e =>
    entrepriseFormat(user, e)
  )

  titreEtape.amodiataires = titreEtape.amodiataires?.map(e =>
    entrepriseFormat(user, e)
  )

  return titreEtape
}

export { titreEtapeFormatFields, titreEtapeFormat }
