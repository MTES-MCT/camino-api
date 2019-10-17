import fileCreate from '../../file-create'
import { readFileSync } from 'fs'

const domainesIds = ['r', 'c', 'f', 'g', 'h', 'm', 's', 'w']
const documentsTypes = JSON.parse(
  readFileSync('./sources/documents-types.json')
)

function main() {
  domainesIds.forEach(async domaineId => {
    const filePath = `./sources/titres-${domaineId}-titres-documents.json`

    const documents = JSON.parse(readFileSync(filePath))

    const documentsNew = documents.map(document => {
      document.type_id = documentsTypes.find(
        ({ nom }) => nom === document.type
      ).id

      delete document.type

      return document
    })

    console.log(documentsNew)

    await fileCreate(filePath, JSON.stringify(documentsNew, null, 2))
  })
}

main()
