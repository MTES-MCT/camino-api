import 'dotenv/config'
import '../../../database/index'

import { titresDocumentsGet } from '../../../database/queries/titres-documents'

import * as fs from 'fs'
import * as path from 'path'

async function main() {
  const titresDocuments = await titresDocumentsGet()
  const titresDocumentsIndex = titresDocuments.reduce((res, titreDocument) => {
    if (titreDocument.fichier) {
      res[titreDocument.fichier] = true
    }

    return res
  }, {})

  const pdfFiles = fs.readdirSync('./files')
  const pdfNames = pdfFiles.map(pdfFile => path.basename(pdfFile, '.pdf'))

  const pdfIndex = pdfNames.reduce((res, pdfName) => {
    if (pdfName) {
      res[pdfName] = true
    }

    return res
  }, {})

  const pdfMissing = pdfNames.filter(
    pdfName => pdfName && !titresDocumentsIndex[pdfName]
  )

  if (pdfMissing.length === 0) {
    console.log('Tous les pdfs sont présents dans la base de données')
  } else {
    console.log(
      `${pdfMissing.length} pdfs n'existent pas dans la base de données`
    )
    console.log(pdfMissing.map(pdf => `- ${pdf}`).join('\n'))
  }

  const titreDocumentsFichiersMissing = Object.keys(
    titresDocumentsIndex
  ).filter(titresDocumentsName => !pdfIndex[titresDocumentsName])
  if (titreDocumentsFichiersMissing.length === 0) {
    console.log(
      'Tous les noms de fichiers renseignés en base de données existent'
    )
  } else {
    console.log(
      `${titreDocumentsFichiersMissing.length} noms de fichiers renseignés en base de données n'existent pas`
    )
    console.log(
      titreDocumentsFichiersMissing.map(titres => `- ${titres}`).join('\n')
    )
  }

  process.exit(0)
}

main()
