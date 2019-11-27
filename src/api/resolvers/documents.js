import { debug } from '../../config/index'
import { titrePermissionCheck } from './permissions/titre'
import { titreDocumentGet } from '../../database/queries/titres-documents'
import { titreEtapeGet } from '../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../database/queries/titres-demarches'
import { titreGet } from '../../database/queries/titres'
import { utilisateurGet } from '../../database/queries/utilisateurs'

const documentNameGet = async (userId, titreDocumentId) => {
  try {
    if (!titreDocumentId) {
      throw new Error('id du document absent')
    }

    const titreDocument = await titreDocumentGet(titreDocumentId)
    const titreDocumentFileName = `${titreDocument.id}.${titreDocument.fichierTypeId}`

    if (!titreDocument || !titreDocument.fichier) {
      throw new Error('fichier inexistant')
    }

    if (titreDocument.public) {
      return titreDocumentFileName
    }

    if (!userId) {
      throw new Error('permissions insuffisantes')
    }

    const user = await utilisateurGet(userId)

    if (!user) {
      throw new Error('utilisateur inexistant')
    }

    const titreEtape = await titreEtapeGet(titreDocument.titreEtapeId)
    const titreDemarche = await titreDemarcheGet(titreEtape.titreDemarcheId)
    const titre = await titreGet(titreDemarche.titreId)

    if (!titrePermissionCheck(titre, user, ['super', 'admin', 'editeur'])) {
      throw new Error('permissions insuffisantes')
    }

    return titreDocumentFileName
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { documentNameGet }
