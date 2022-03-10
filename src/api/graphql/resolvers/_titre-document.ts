import { join } from 'path'

import { IDocumentRepertoire } from '../../../types'

import { dirDelete } from '../../../tools/dir-delete'

const fichiersRepertoireDelete = async (
  id: string,
  repertoire: IDocumentRepertoire
) => {
  const repertoirePath = `files/${repertoire}/${id}`
  try {
    await dirDelete(join(process.cwd(), repertoirePath))
  } catch (e) {
    console.error(`impossible de supprimer le répertoire: ${repertoirePath}`, e)
  }
}

export { fichiersRepertoireDelete }
