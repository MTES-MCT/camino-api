import { readdirSync } from 'fs'
import { basename, extname } from 'path'

import 'dotenv/config'
import '../../src/database/index'

import { titresDocumentsGet } from '../../src/database/queries/titres-documents'

async function main() {
  const titresDocuments = await titresDocumentsGet()
  const titresDocumentsIndex = titresDocuments.reduce((res, titreDocument) => {
    if (titreDocument.fichier) {
      res[titreDocument.id] = true
    }

    return res
  }, {})

  const files = readdirSync('./files')
  const fileNames = files
    .filter(file => extname(file) === '.pdf')
    .map(file => basename(file, '.pdf'))

  const filesIndex = fileNames.reduce((res, fileName) => {
    if (fileName) {
      res[fileName] = true
    }

    return res
  }, {})

  const filesMissing = fileNames.filter(
    fileName => fileName && !titresDocumentsIndex[fileName]
  )

  if (filesMissing.length === 0) {
    console.log(
      'Tous les fichiers correspondent à des documents dans la base de données'
    )
  } else {
    console.log(
      `${filesMissing.length} fichiers ne correspondent a aucun document dans la base de données`
    )
    console.log(filesMissing.map(file => `- ${file}`).join('\n'))
  }

  const titreDocumentsFichiersMissing = Object.keys(
    titresDocumentsIndex
  ).filter(titresDocumentsName => !filesIndex[titresDocumentsName])
  if (titreDocumentsFichiersMissing.length === 0) {
    console.log(
      'Tous les documents en base de données ont des fichiers correspondants'
    )
  } else {
    console.log(
      `${titreDocumentsFichiersMissing.length} documents en base de données n'ont pas de fichiers correspondants`
    )
    console.log(
      titreDocumentsFichiersMissing.map(titres => `- ${titres}`).join('\n')
    )
  }

  process.exit(0)
}

main()
