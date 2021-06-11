import { IDocument, IDocumentRepertoire } from '../../types'

const documentRepertoireFind = (document: IDocument): IDocumentRepertoire => {
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

  return 'tmp'
}

export { documentRepertoireFind }
