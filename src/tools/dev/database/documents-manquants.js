import 'dotenv/config'
import '../../../database/index'

import { titresDocumentsGet } from '../../../database/queries/titres-documents'

import * as fs from 'fs'

async function main() {
  const titresDocuments = await titresDocumentsGet()
  const titresDocumentsListe = titresDocuments.reduce(
    (arr, titreDocument) =>
      titreDocument.fichier ? [...arr, titreDocument.fichier] : arr,
    []
  )

  const pdfFiles = fs.readdirSync('././././files')
  const pdfNames = pdfFiles.map(pdfFile => pdfFile.split('.')[0])

  const pdfMiss = pdfNames.filter(
    pdfName => titresDocumentsListe.indexOf(pdfName) === -1
  )

  if (pdfMiss.length === 0) {
    console.log('Tous les pdfs sont présents dans la base de données')
  } else {
    let texte = `Il manque les pdfs suivants dans la base de données:`
    pdfMiss.forEach(pdf => (texte += `\n- ${pdf}`))
    console.log(texte)
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
  }

  process.exit(0)
}

main()
