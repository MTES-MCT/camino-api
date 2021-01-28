import { Index } from '../../types'
import { IndexFile } from './_types'

const filesPathCheck = (
  documentsIndex: IndexFile,
  filesIndex: Index<string>
) => {
  const filesPathInvalid = Object.keys(filesIndex)
    .sort()
    .filter(
      fileName =>
        fileName &&
        documentsIndex[fileName] &&
        filesIndex[fileName].substr(8) !== documentsIndex[fileName].path
    )

  if (filesPathInvalid.length) {
    console.info(
      `${filesPathInvalid.length} fichiers ne sont pas au bon endroit sur le disque`
    )
    filesPathInvalid.forEach(file =>
      console.info(
        `- ${filesIndex[file].substr(8)} -> ${documentsIndex[file].path}`
      )
    )
  } else {
    console.info('tous les fichiers sont au bon endroit sur le disque')
  }
}

export { filesPathCheck }
