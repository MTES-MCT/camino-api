import 'dotenv/config'
import '../../../database/index'

import { titresDocumentsGet } from '../../../database/queries/titres-documents'

import * as fs from 'fs'
import * as path from 'path'

async function main() {
  const titresDocuments = await titresDocumentsGet()
  const titresDocumentsListe = titresDocuments.reduce(
    (arr, titreDocument) =>
      titreDocument.fichier ? [...arr, titreDocument.fichier] : arr,
    []
  )

  const pdfFiles = fs.readdirSync('././././files')
  const pdfNames = pdfFiles.map(pdfFile => path.basename(pdfFile, '.pdf'))

  const pdfMiss = pdfNames.filter(
    pdfName => titresDocumentsListe.indexOf(pdfName) === -1
  )

  if (pdfMiss.length === 0) {
    console.log('Tous les pdfs sont présents dans la base de données')
  } else {
    console.log(`Il manque ${pdfMiss.length} pdfs  dans la base de données`)
    console.log(pdfMiss.map(pdf => `- ${pdf}`).join('\n'))
  }

  const titresDocumentsMiss = titresDocumentsListe.filter(
    titresDocumentsName => pdfNames.indexOf(titresDocumentsName) === -1
  )
  if (titresDocumentsMiss.length === 0) {
    console.log('Tous les documents sont présents dans les fichiers')
  } else {
    console.log(
      `Il manque ${titresDocumentsMiss.length} documents dans les fichiers`
    )
    console.log(titresDocumentsMiss.map(titres => `- ${titres}`).join('\n'))
  }

  process.exit(0)
}

main()
