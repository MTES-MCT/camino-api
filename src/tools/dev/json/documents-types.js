import fileCreate from '../../file-create'
import fileRename from '../../file-rename'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const domainesIds = ['r', 'c', 'f', 'g', 'h', 'm', 's', 'w']
const documentsTypes = JSON.parse(
  readFileSync('./sources/documents-types.json')
)

async function main() {
  domainesIds.forEach(async domaineId => {
    const filePath = `./sources/titres-${domaineId}-titres-documents.json`

    const documents = JSON.parse(readFileSync(filePath))

    documents.forEach(async document => {
      // renomme les fichiers avec l'id du document
      // ajoute la colonne fichier_type_id
      // remplace la colonne fichier par un booléen (true si il y a un fichier)
      if (document.fichier && document.fichier !== 'TRUE') {
        const documentPath = join(
          process.cwd(),
          `files/${document.fichier}.pdf`
        )

        if (existsSync(documentPath)) {
          await fileRename(
            documentPath,
            join(process.cwd(), `files/${document.id}.pdf`)
          )
        }
      }
    })

    // converti la colonne titres_documents.type en titres_documents.type_id
    const documentsNew = documents.map(document => {
      if (!document.type_id && document.type) {
        document.type_id = documentsTypes.find(
          ({ nom }) => nom === document.type
        ).id

        delete document.type
      }

      // renomme les fichiers avec l'id du document
      // ajoute la colonne fichier_type_id
      // remplace la colonne fichier par un booléen (true si il y a un fichier)
      if (document.fichier && document.fichier !== 'TRUE') {
        document.fichier = 'TRUE'
      }

      if (document.fichier === 'TRUE') {
        document.fichier_type_id = 'pdf'
      }

      return document
    })

    await fileCreate(filePath, JSON.stringify(documentsNew, null, 2))
  })
}

main()
