import { filesDocumentCheck } from './files-document-check'
import { documentsIndexBuild } from './documents-index-build'
import { filesIndexBuild } from './files-index-build'
import { documentsFilesCheck } from './documents-files-check'
import { filesPathCheck } from './files-path-check'

const documentsCheck = async () => {
  const documentsIndex = await documentsIndexBuild()
  const filesIndex = filesIndexBuild()

  documentsFilesCheck(documentsIndex, filesIndex)
  filesDocumentCheck(documentsIndex, filesIndex)
  filesPathCheck(documentsIndex, filesIndex)
}

export default documentsCheck
