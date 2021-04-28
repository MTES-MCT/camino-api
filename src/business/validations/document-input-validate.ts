import { IDocument } from '../../types'

import { dateValidate } from '../../tools/date'

const documentInputValidate = async (document: IDocument) => {
  const errors = [] as string[]

  if (!document.id && !document.typeId) {
    errors.push('type de fichier manquant')
  }

  if (document.fichierNouveau && !document.fichierTypeId) {
    errors.push('extension du fichier manquante')
  }

  const dateError = dateValidate(document.date)
  if (dateError) {
    errors.push(dateError)
  }

  return errors
}

export { documentInputValidate }
