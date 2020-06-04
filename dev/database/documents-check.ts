import { readdirSync } from 'fs'
import { basename, extname } from 'path'

import 'dotenv/config'
import '../../src/database/index'

import { documentsGet } from '../../src/database/queries/documents'

type Index = { [id: string]: string }

const etapeGet = (str: string) =>
  str
    .split('-')
    .slice(0, -1)
    .join('-')

const hashGet = (str: string) => str.split('-').pop()

const matchFuzzy = (name: string, index: Index, partGet = hashGet) => {
  const hash = name.split('-').pop()

  return Object.keys(index).reduce((r, key) => {
    // on ne garde pas les matches entiers pendant un fuzzy
    if (key === name) {
      return r
    }

    const part = partGet(key)

    if (part === hash) {
      r.push(key)
    }

    return r
  }, [])
}

const filesNoDocumentCheck = (
  filesNames: string[],
  documentsIndex: Index,
  filesIndex: Index
) => {
  const filesMissing = filesNames
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
            name: fileName,
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
      'Tous les fichiers correspondent à des documents dans la base de données'
    )
  }
}

const documentsNoFileCheck = (documentsIndex: Index, filesIndex: Index) => {
  const documentsFichiersMissing = Object.keys(documentsIndex)
    .filter(documentsName => !filesIndex[documentsName])
    .sort()

  if (documentsFichiersMissing.length) {
    console.info(
      `${documentsFichiersMissing.length} documents en base de données n'ont pas de fichiers correspondants`
    )

    documentsFichiersMissing.forEach(name => {
      console.info(`-      ${name}`)

      const matches = matchFuzzy(name, filesIndex)

      if (matches.length) {
        matches.forEach(name => {
          console.info(`Match: ${name}`)
        })
      }
    })
  } else {
    console.info(
      'Tous les documents en base de données ont des fichiers correspondants'
    )
  }
}

const main = async () => {
  const documents = await documentsGet({}, {}, 'super')

  const documentsIndex = documents.reduce((res, document) => {
    if (document.fichier) {
      res[document.id] = true
    }

    return res
  }, {})

  const files = readdirSync('./files')
  const filesNames = files
    .filter(file => extname(file) === '.pdf')
    .map(file => basename(file, '.pdf'))

  const filesIndex = filesNames.reduce((res, fileName) => {
    if (fileName) {
      res[fileName] = true
    }

    return res
  }, {})

  documentsNoFileCheck(documentsIndex, filesIndex)

  console.info()

  filesNoDocumentCheck(filesNames, documentsIndex, filesIndex)

  process.exit(0)
}

main()
