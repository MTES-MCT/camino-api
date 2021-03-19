import {
  ITitreEtape,
  ITitreDemarche,
  ITitre,
  IEtapeTypeDocumentType
} from '../../types'

import { titreEtapeTypeAndStatusValidate } from './titre-etape-type-and-status-validate'
import { titreEtapePointsValidate } from './titre-etape-points-validate'
import { titreDemarcheUpdatedEtatValidate } from './titre-demarche-etat-validate'
import { documentsTypesValidate } from './documents-types-validate'

const titreEtapeUpdationValidate = async (
  titreEtape: ITitreEtape,
  titreDemarche: ITitreDemarche,
  titre: ITitre,
  documentsTypes: IEtapeTypeDocumentType[]
) => {
  const errors = []

  // 1. le type d'étape correspond à la démarche et au type de titre
  const titreEtapeTypeAndStatusErrors = titreEtapeTypeAndStatusValidate(
    titreEtape.typeId,
    titreEtape.statutId,
    titreDemarche.type!.etapesTypes,
    titreDemarche.type!.nom
  )
  if (titreEtapeTypeAndStatusErrors.length) {
    errors.push(...titreEtapeTypeAndStatusErrors)
  }

  // 2. la date de l'étape est possible
  // en fonction de l'ordre des types d'étapes de la démarche
  const demarcheUpdatedErrors = titreDemarcheUpdatedEtatValidate(
    titreDemarche.type!,
    titre,
    titreEtape,
    titreDemarche.etapes!
  )
  if (demarcheUpdatedErrors.length) {
    errors.push(...demarcheUpdatedErrors)
  }

  // 3. les références de points sont bien renseignées
  if (titreEtape.points) {
    const error = titreEtapePointsValidate(titreEtape.points)
    if (error) {
      errors.push(error)
    }
  }

  // 4. si l’étape n’est pas en cours de construction, les fichiers obligatoires sont tous renseignés et complets
  if (titreEtape.statutId !== 'aco' && documentsTypes!.length) {
    const documentsErrors = documentsTypesValidate(
      titreEtape.documents,
      documentsTypes
    )
    if (documentsErrors.length) {
      errors.push(...documentsErrors)
    }
  }

  return errors
}

export { titreEtapeUpdationValidate }
