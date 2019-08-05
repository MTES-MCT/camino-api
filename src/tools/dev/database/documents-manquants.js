import 'dotenv/config'
import '../../../database/index'

import { titresDocumentsGet } from '../../../database/queries/titres-documents'

import * as fs from 'fs'
import * as path from 'path'

async function main() {
  const titresDocuments = await titresDocumentsGet()
  const titresDocumentsFichiers = titresDocuments.reduce(
    (arr, titreDocument) => {
      if (titreDocument.fichier) {
        arr.push(titreDocument.fichier)
      }

      return arr
    },
    []
  )

  const pdfFiles = fs.readdirSync('././././files')
  const pdfNames = pdfFiles.map(pdfFile => path.basename(pdfFile, '.pdf'))

  const pdfMissing = pdfNames.filter(
    pdfName => titresDocumentsFichiers.indexOf(pdfName) === -1
  )

  if (pdfMissing.length === 0) {
    console.log('Tous les pdfs sont présents dans la base de données')
  } else {
    console.log(
      `${pdfMissing.length} pdfs n'existent pas dans la base de données`
    )
    console.log(pdfMissing.map(pdf => `- ${pdf}`).join('\n'))
  }

  const titreDocumentsFichiersMissing = titresDocumentsFichiers.filter(
    titresDocumentsName => pdfNames.indexOf(titresDocumentsName) === -1
  )
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
