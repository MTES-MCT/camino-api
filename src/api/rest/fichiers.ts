import { IFormat } from '../../types'

import { documentGet } from '../../database/queries/documents'

const fichier = async (
  { documentId }: { documentId?: string },
  userId?: string | undefined
) => {
  if (!documentId) {
    throw new Error('id du document absent')
  }

  const document = await documentGet(
    documentId,
    {
      fields: {
        type: { id: {} },
        etape: { id: {} },
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

  const format = 'pdf' as IFormat

  if (repertoire === 'demarches') {
    dossier = document.etape!.id
  } else if (repertoire === 'activites') {
    dossier = document.activite!.id
  } else if (repertoire === 'entreprises') {
    dossier = document.entreprise!.id
  }

  const nom = `${document.date}-${dossier}-${document.typeId}.${format}`

  const filePath = `${repertoire}/${dossier}/${document.id}.${document.fichierTypeId}`

  return {
    nom,
    format,
    filePath
  }
}

export { fichier }
