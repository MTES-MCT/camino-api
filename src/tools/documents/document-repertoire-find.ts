import { IDocument, IDocumentRepertoire } from '../../types'

const documentRepertoireFind = (
  document: IDocument
): IDocumentRepertoire | null => {
  if (document.titreActiviteId) {
    return 'activites'
  }

  if (document.titreEtapeId) {
    return 'demarches'
  }

  if (document.titreTravauxEtapeId) {
    return 'travaux'
  }

  if (document.entrepriseId) {
    return 'entreprises'
  }

  return null
}

export { documentRepertoireFind }
