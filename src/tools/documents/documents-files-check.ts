import { Index } from '../../types'
import { IndexFile } from './_types'
import { matchFuzzy } from './_utils'

const documentsFilesCheck = (
  documentsIndex: IndexFile,
  filesIndex: Index<string>
) => {
  const documentsFichiersMissing = Object.keys(documentsIndex)
    .filter(documentId => !filesIndex[documentId])
    .sort()

  if (documentsFichiersMissing.length) {
    console.info(
      `${documentsFichiersMissing.length} documents en base de données n'ont pas de fichiers correspondants`
    )

    documentsFichiersMissing.forEach(documentId => {
      const document = documentsIndex[documentId].document
      console.info(
        `-      ${documentId}.${document.fichierTypeId} -> ${document.titreEtapeId}`
      )

      const matches = matchFuzzy(documentId, filesIndex)

      if (matches.length) {
        matches.forEach(name => {
          console.info(`Match: ${filesIndex[name]}`)
        })
      }
    })
  } else {
    console.info(
      'Tous les documents en base de données ont des fichiers correspondants'
    )
  }
}

export { documentsFilesCheck }
