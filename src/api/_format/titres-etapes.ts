import { ITitreEtape, IGeoJson } from '../../types'

import {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} from '../../tools/geojson'
import { etapeTypeFormat } from './etapes-types'
import { administrationFormat } from './administrations'
import { entrepriseFormat } from './entreprises'
import { titreEtapeFormatFields } from './_fields'
import { titreDemarcheFormat } from './titres-demarches'
import { titreEtapeCompleteValidate } from '../../business/validations/titre-etape-updation-validate'

const titreEtapeFormat = (
  titreEtape: ITitreEtape,
  fields = titreEtapeFormatFields
) => {
  if (titreEtape.demarche) {
    titreEtape.demarche = titreDemarcheFormat(
      titreEtape.demarche,
      fields.demarche
    )
  }

  if (titreEtape.type) {
    titreEtape.type = etapeTypeFormat(
      titreEtape.type,
      titreEtape.sectionsSpecifiques,
      titreEtape.documentsTypesSpecifiques,
      titreEtape.justificatifsTypesSpecifiques
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
      ) as unknown as IGeoJson
    }
  }

  if (!titreEtape.modification) {
    delete titreEtape.heritageProps
    delete titreEtape.heritageContenu
  }

  titreEtape.administrations =
    titreEtape.administrations?.map(administrationFormat)

  titreEtape.titulaires = titreEtape.titulaires?.map(entrepriseFormat)

  titreEtape.amodiataires = titreEtape.amodiataires?.map(entrepriseFormat)

  if (
    titreEtape.typeId === 'mfr' &&
    titreEtape.statutId === 'aco' &&
    titreEtape.modification
  ) {
    const errors = titreEtapeCompleteValidate(
      { ...titreEtape, statutId: 'dep' },
      titreEtape.type!.sections!,
      titreEtape.type!.documentsTypes!,
      titreEtape.documents,
      titreEtape.type!.justificatifsTypes!,
      titreEtape.justificatifs
    )

    titreEtape.deposable = errors.length === 0
  }

  return titreEtape
}

export { titreEtapeFormatFields, titreEtapeFormat }
