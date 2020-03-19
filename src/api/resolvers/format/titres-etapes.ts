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
import { administrationsFormat } from './administrations'
import { entreprisesFormat } from './entreprises'
import { titreEtapePermissionAdministrationsCheck } from '../permissions/titre-edition'

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
  titreStatutId: string,
  titreDemarcheType: IDemarcheType,
  {
    userHasPermission,
    isSuper,
    isAdmin
  }: { userHasPermission?: boolean; isSuper: boolean; isAdmin: boolean },
  fields = titreEtapeFormatFields
) => {
  if (isSuper || isAdmin) {
    titreEtape.editable =
      isSuper ||
      titreEtapePermissionAdministrationsCheck(
        user,
        titreTypeId,
        titreStatutId,
        titreEtape.typeId,
        'modification'
      )

    titreEtape.supprimable = isSuper
  }

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

  if (titreEtape.documents) {
    if (!userHasPermission) {
      titreEtape.documents = titreEtape.documents.filter(
        titreDocument => titreDocument.public
      )
    } else {
      titreEtape.documents.forEach(titreDocument => {
        titreDocument.editable = titreEtape.editable
        titreDocument.supprimable = isSuper
      })
    }
  }

  if (titreEtape.administrations) {
    titreEtape.administrations = administrationsFormat(
      user,
      titreEtape.administrations
    )
  }

  if (titreEtape.titulaires) {
    titreEtape.titulaires = entreprisesFormat(user, titreEtape.titulaires)
  }

  if (titreEtape.amodiataires) {
    titreEtape.amodiataires = entreprisesFormat(user, titreEtape.amodiataires)
  }

  return titreEtape
}

export { titreEtapeFormatFields, titreEtapeFormat }
