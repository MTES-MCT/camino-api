import {
  IActiviteTypeDocumentType,
  ISection,
  ITitreActivite
} from '../../types'
import { documentsTypesValidate } from './documents-types-validate'

const titreActiviteCompleteCheck = (
  titreActivite: ITitreActivite,
  activiteSections: ISection[],
  documentsTypes?: IActiviteTypeDocumentType[]
) => {
  const activiteComplete = activiteSections.every(s =>
    s.elements?.every(
      e =>
        e.optionnel ||
        (titreActivite.contenu &&
          titreActivite.contenu[s.id][e.id] !== undefined &&
          titreActivite.contenu[s.id][e.id] !== null)
    )
  )

  if (!activiteComplete) {
    return false
  }

  const documentsErrors = documentsTypesValidate(
    titreActivite.documents,
    documentsTypes
  )

  return !documentsErrors.length
}

export { titreActiviteCompleteCheck }
