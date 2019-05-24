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
  const pdfNames = pdfFiles.map(pdfFile => path.basename(pdfFile))

  const pdfMiss = pdfNames.filter(
    pdfName => titresDocumentsListe.indexOf(pdfName) === -1
  )

  console.log(
    pdfMiss.length === 0
      ? 'Tous les pdfs sont présents dans la base de données'
      : `Il manque les pdfs suivants dans la base de données:`
  )
  console.log(pdfMiss.map(pdf => `- ${pdf}`).join('\n'))

  const titresDocumentsMiss = titresDocumentsListe.filter(
    titresDocumentsName => pdfNames.indexOf(titresDocumentsName) === -1
  )
  console.log(
    titresDocumentsMiss.length === 0
      ? 'Tous les documents sont présents dans les fichiers'
      : `Il manque ${titresDocumentsMiss.length} documents dans les fichiers`
  )
  console.log(titresDocumentsMiss.map(titres => `- ${titres}`).join('\n'))

  process.exit(0)
}

main()
