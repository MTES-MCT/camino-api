import { IDocument } from '../../types'
import { documentRepertoireFind } from './document-repertoire-find'
import dirCreate from '../dir-create'

const documentFilePathFind = async (document: IDocument, creation = false) => {
  const repertoire = documentRepertoireFind(document)

  const parentId =
    document.titreEtapeId ||
    document.titreActiviteId ||
    document.entrepriseId ||
    document.titreTravauxEtapeId

  let dirPath = `files/${repertoire}`

  if (parentId) {
    dirPath += `/${parentId}`
  }

  if (creation) {
    await dirCreate(dirPath)
  }

  return `${dirPath}/${document.id}.${document.fichierTypeId}`
}

export { documentFilePathFind }
