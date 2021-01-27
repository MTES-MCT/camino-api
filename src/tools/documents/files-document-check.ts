import { Index } from '../../types'
import { IndexFile } from './_types'
import { matchFuzzy } from './_utils'

const etapeGet = (str: string) => str.split('-').slice(0, -1).join('-')

const filesDocumentCheck = (
  documentsIndex: IndexFile,
  filesIndex: Index<string>
) => {
  const filesMissing = Object.keys(filesIndex)
    .sort()
    .reduce(
      (
        r: {
          name: string
          documentsHashMatches: string[]
          filesHashMatches: string[]
          filesEtapeMatches: string[]
        }[],
        fileName
      ) => {
        if (fileName && !documentsIndex[fileName]) {
          r.push({
            name: filesIndex[fileName],
            documentsHashMatches: matchFuzzy(fileName, documentsIndex),
            filesHashMatches: matchFuzzy(fileName, filesIndex),
            filesEtapeMatches: matchFuzzy(fileName, filesIndex, etapeGet)
          })
        }

        return r
      },
      []
    )
    // trie les fichiers sans hash en base en premier
    .sort(
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
