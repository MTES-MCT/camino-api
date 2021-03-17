import { IActiviteTypeDocumentType, IDocument } from '../../types'

const documentsTypesValidate = (
  documents?: IDocument[] | null,
  documentsTypes?: IActiviteTypeDocumentType[]
) => {
  const errors = [] as string[]

  if (documentsTypes) {
    documentsTypes
      .filter(dt => !dt.optionnel)
      .forEach(dt => {
        if (
          !documents?.find(
            d =>
              d.typeId === dt.id &&
              !!(d.fichier || d.fichierNouveau) &&
              d.fichierTypeId &&
              d.date
          )
        ) {
          errors.push(`le document "${dt.id}" est obligatoire`)
        }
      })
  } else if (documents?.length) {
    errors.push(`impossible de lier un document`)
  }

  return errors
}

export { documentsTypesValidate }
