import auth from './_auth'
import { titreGet } from '../../database/queries/titres'
import { titreDocumentGet } from '../../database/queries/titres-documents'
import { utilisateurGet } from '../../database/queries/utilisateurs'

const fileDownloadPermissionCheck = async (
  userId,
  titreId,
  titreDocumentId
) => {
  const document = await titreDocumentGet(titreDocumentId)

  if (!document) return false

  if (document.public) return true

  if (!userId) return false

  const titre = await titreGet(titreId)
  const user = await utilisateurGet(userId)

  return auth(user, titre, ['admin', 'super', 'editeur'])
}

export { fileDownloadPermissionCheck }
