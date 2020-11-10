import 'dotenv/config'
import '../../init'

import { filesDocumentCheck } from '../tools/documents/files-document-check'
import { documentsIndexBuild } from '../tools/documents/documents-index-build'
import { filesIndexBuild } from '../tools/documents/files-index-build'
import { documentsFilesCheck } from '../tools/documents/documents-files-check'
import { filesPathCheck } from '../tools/documents/files-path-check'

const documentsCheck = async () => {
  const documentsIndex = await documentsIndexBuild()
  const filesIndex = filesIndexBuild()

  documentsFilesCheck(documentsIndex, filesIndex)

  console.info()

  filesDocumentCheck(documentsIndex, filesIndex)

  console.info()

  filesPathCheck(documentsIndex, filesIndex)

  process.exit(0)
}

documentsCheck()
