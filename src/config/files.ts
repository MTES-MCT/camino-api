import dirCreate from '../tools/dir-create'
import { DOCUMENTS_REPERTOIRES } from '../types'

export const filesInit = async () => {
  await dirCreate('files').catch()

  for (const documentsRepertoire of DOCUMENTS_REPERTOIRES) {
    await dirCreate(`files/${documentsRepertoire}`).catch()
  }
}
