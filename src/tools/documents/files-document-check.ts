import { Index } from '../../types'
import { IndexFile } from './_types'
import { matchFuzzy } from './_utils'
import { titreEtapeGet } from '../../database/queries/titres-etapes'
import { userSuper } from '../../database/user-super'
import { contenuFilesGet } from '../../business/utils/contenu-element-file-process'
import { etapeTypeSectionsFormat } from '../../api/_format/etapes-types'

const etapeGet = (str: string) => str.split('-').slice(0, -1).join('-')

const contenuFilesCheck = async (filePath: string) => {
  // c’est peut-être un fichier d’un contenu d’étape

  const split = filePath.split('/')
  if (split[2] !== 'demarches') {
    return false
  }
  const etapeId = split[3]
  const etape = await titreEtapeGet(
    etapeId,
    { fields: { type: { id: {} } } },
    userSuper
  )
  if (etape) {
    const sections = etapeTypeSectionsFormat(
      etape.type!.sections,
      etape.sectionsSpecifiques
    )
    const contenuFiles = contenuFilesGet(etape.contenu, sections)

    return contenuFiles.includes(split[4])
  }

  return false
}
const filesDocumentCheck = async (
  documentsIndex: IndexFile,
  filesIndex: Index<string>
) => {
  const filesMissing = [] as {
    name: string
    documentsHashMatches: string[]
    filesHashMatches: string[]
    filesEtapeMatches: string[]
  }[]

  for (const fileName of Object.keys(filesIndex).sort()) {
    if (
      fileName &&
      !documentsIndex[fileName] &&
      !(await contenuFilesCheck(filesIndex[fileName]))
    ) {
      filesMissing.push({
        name: filesIndex[fileName],
        documentsHashMatches: matchFuzzy(fileName, documentsIndex),
        filesHashMatches: matchFuzzy(fileName, filesIndex),
        filesEtapeMatches: matchFuzzy(fileName, filesIndex, etapeGet)
      })
    }
  }

  // trie les fichiers sans hash en base en premier
  filesMissing.sort(
    (a, b) =>
      a.documentsHashMatches.length +
      a.filesHashMatches.length +
      a.filesEtapeMatches.length -
      (b.documentsHashMatches.length +
        b.filesHashMatches.length +
        b.filesEtapeMatches.length)
  )

  if (filesMissing.length) {
    console.info(
      `${filesMissing.length} fichiers ne correspondent à aucun document dans la base de données`
    )

    filesMissing.forEach(file => {
      console.info(`- ${file.name}`)

      if (file.documentsHashMatches.length) {
        const documentsHashMatchesString = ` (${file.documentsHashMatches.length} hashe(s) en base)`

        console.info(
          `${documentsHashMatchesString}:`,
          file.documentsHashMatches.join(', ')
        )
      }

      if (
        file.filesHashMatches.length &&
        file.filesHashMatches[0] !== file.documentsHashMatches[0]
      ) {
        const filesHashMatchesString = ` (${file.filesHashMatches.length} autre(s) hashe(s) dans les fichiers)`

        console.info(
          `${filesHashMatchesString}:`,
          file.filesHashMatches.join(', ')
        )
      }

      if (
        file.filesEtapeMatches.length &&
        file.filesEtapeMatches[0] !== file.documentsHashMatches[0]
      ) {
        const filesEtapeMatchesString = ` (${file.filesEtapeMatches.length} autre(s) etape(s) dans les fichiers)`

        console.info(
          `${filesEtapeMatchesString}:`,
          file.filesEtapeMatches.join(', ')
        )
      }
    })
  } else {
    console.info(
      'tous les fichiers correspondent à des documents dans la base de données'
    )
  }
}

export { filesDocumentCheck }
