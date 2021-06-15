import { IDocument, IDocumentType, ISection, ITitreActivite } from '../../types'

import { documentsTypesValidate } from './documents-types-validate'

const titreActiviteCompleteCheck = (
  titreActivite: ITitreActivite,
  activiteSections: ISection[],
  documents?: IDocument[] | null,
  documentsTypes?: IDocumentType[]
) => {
  const activiteComplete = activiteSections.every(s =>
    s.elements?.every(
      e =>
        e.optionnel ||
        (titreActivite.contenu &&
          (e.type === 'checkboxes'
            ? (titreActivite.contenu[s.id][e.id] as string[]).length
            : titreActivite.contenu[s.id][e.id] !== undefined &&
              titreActivite.contenu[s.id][e.id] !== null &&
              titreActivite.contenu[s.id][e.id] !== ''))
    )
  )

  if (!activiteComplete) {
    return false
  }

  const documentsErrors = documentsTypesValidate(documents, documentsTypes)

  return !documentsErrors.length
}

export { titreActiviteCompleteCheck }
