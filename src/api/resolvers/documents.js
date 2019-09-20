import { titrePermissionCheck } from './_titre'
import { titreDocumentGet } from '../../database/queries/titres-documents'
import { titreEtapeGet } from '../../database/queries/titres-etapes'
import { titreDemarcheGet } from '../../database/queries/titres-demarches'
import { titreGet } from '../../database/queries/titres'
import { utilisateurGet } from '../../database/queries/utilisateurs'

const documentNameGet = async (userId, titreDocumentId) => {
  if (!titreDocumentId) {
    throw new Error('id du document absent')
  }

  const titreDocument = await titreDocumentGet(titreDocumentId)

  if (!titreDocument || !titreDocument.fichier) {
    throw new Error('fichier inexistant')
  }

  if (titreDocument.public) return `${titreDocument.fichier}.pdf`

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

  if (!titrePermissionCheck(titre, user, ['admin', 'super', 'editeur'])) {
    throw new Error('permissions insuffisantes')
  }

  return `${titreDocument.fichier}.pdf`
}

export { documentNameGet }
