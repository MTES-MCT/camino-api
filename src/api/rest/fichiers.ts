import { IFormat } from '../../types'

import { documentGet } from '../../database/queries/documents'

const fichier = async (
  { documentId }: { documentId?: string },
  userId?: string | undefined
) => {
  if (!userId) {
    throw new Error('droits insuffisants')
  }

  if (!documentId) {
    throw new Error('id du document absent')
  }

  const document = await documentGet(
    documentId,
    {
      fields: {
        type: { id: {} },
        etapes: { id: {} },
        activite: { id: {} },
        entreprise: { id: {} }
      }
    },
    userId
  )

  if (!document || !document.fichier) {
    throw new Error('fichier inexistant')
  }

  let dossier

  const repertoire = document.type!.repertoire

  if (repertoire === 'etapes') {
    dossier = document.etape!.id
  } else if (repertoire === 'activites') {
    dossier = document.activite!.id
  } else if (repertoire === 'entreprises') {
    dossier = document.entreprise!.id
  }

  const nom = `${repertoire}/${dossier}/${document.id}.${document.fichierTypeId}`
  const format = 'pdf' as IFormat

  return {
    nom,
    format,
    file: true
  }
}

export { fichier }
