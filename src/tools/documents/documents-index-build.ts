import { IDocument } from '../../types'
import { IndexFile } from './_types'

import { documentsGet } from '../../database/queries/documents'
import { exhaustiveCheck } from '../exhaustive-type-check'

const documentPathGet = (document: IDocument) => {
  let path = document.type!.repertoire as string

  if (document.type!.repertoire === 'demarches') {
    path = `${path}/${document.titreEtapeId}`
  } else if (document.type!.repertoire === 'entreprises') {
    path = `${path}/${document.entrepriseId}`
  } else if (document.type!.repertoire === 'activites') {
    path = `${path}/${document.titreActiviteId}`
  } else if (document.type!.repertoire === 'travaux') {
    path = `${path}/${document.titreTravauxEtapeId}`
  } else {
    exhaustiveCheck(document.type!.repertoire)
  }

  return `${path}/${document.id}.${document.fichierTypeId}`
}

const documentsIndexBuild = async () => {
  const documents = await documentsGet({}, {}, 'super')

  return documents.reduce((res: IndexFile, document) => {
    if (document.fichier) {
      res[document.id] = { document, path: documentPathGet(document) }
    }

    return res
  }, {})
}

export { documentsIndexBuild }
