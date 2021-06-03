import { IDocument } from '../../types'
import { documentRepertoireFind } from './document-repertoire-find'
import dirCreate from '../dir-create'

const documentFilePathFind = async (document: IDocument, creation = false) => {
  const repertoire = documentRepertoireFind(document)

  const dirPath = `files/${repertoire}/${
    document.titreEtapeId ||
    document.titreActiviteId ||
    document.entrepriseId ||
    document.titreTravauxEtapeId ||
    ''
  }`

  if (creation) {
    await dirCreate(dirPath)
  }

  return `${dirPath}/${document.id}.${document.fichierTypeId}`
}

export { documentFilePathFind }
