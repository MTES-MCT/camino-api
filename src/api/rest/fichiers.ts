import {
  IContenuElement,
  IContenuValeur,
  IDocumentRepertoire,
  IFormat
} from '../../types'

import { documentGet } from '../../database/queries/documents'
import { userGet } from '../../database/queries/utilisateurs'
import { titreEtapeGet } from '../../database/queries/titres-etapes'

const fichier = async (
  { documentId }: { documentId?: string },
  userId?: string
) => {
  if (!documentId) {
    throw new Error('id du document absent')
  }

  const user = await userGet(userId)

  const document = await documentGet(
    documentId,
    {
      fields: {
        type: { id: {} },
        etape: { id: {} },
        activite: { id: {} },
        entreprise: { id: {} },
        travauxEtape: { id: {} }
      }
    },
    user
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
  } else if (repertoire === 'travaux') {
    dossier = document.travauxEtape!.id
  }

  const nom = `${document.date}-${dossier}-${document.typeId}.${format}`

  const filePath = `${repertoire}/${dossier}/${document.id}.${document.fichierTypeId}`

  return {
    nom,
    format,
    filePath
  }
}

const etapeIdPathGet = (
  etapeId: string,
  fichierNom: string,
  contenu: IContenuValeur,
  heritageContenu: { actif: boolean; etapeId?: string | null }
): null | string => {
  if (Array.isArray(contenu)) {
    const contenuArray = contenu as IContenuElement[]
    for (let i = 0; i < contenuArray.length; i++) {
      const contenuElement = contenuArray[i]
      for (const contenuElementAttr of Object.keys(contenuElement)) {
        const etapeIdFound = etapeIdPathGet(
          etapeId,
          fichierNom,
          contenuElement[contenuElementAttr],
          heritageContenu
        )
        if (etapeIdFound) {
          return etapeIdFound
        }
      }
    }
  } else if (contenu === fichierNom) {
    if (heritageContenu.actif) {
      return heritageContenu.etapeId!
    } else {
      return etapeId
    }
  }

  return null
}

const etapeFichier = async (
  { etapeId, fichierNom }: { etapeId?: string; fichierNom?: string },
  userId?: string
) => {
  if (!etapeId) {
    throw new Error('id de l’étape absent')
  }
  if (!fichierNom) {
    throw new Error('nom du fichier absent')
  }

  const user = await userGet(userId)

  const etape = await titreEtapeGet(etapeId, { fields: {} }, user)

  if (!etape) {
    throw new Error('fichier inexistant')
  }

  let etapeIdPath

  // recherche dans quel élément de quelle section est stocké ce fichier, pour savoir si l’héritage est activé
  for (const sectionId of Object.keys(etape!.contenu!)) {
    for (const elementId of Object.keys(etape.contenu![sectionId])) {
      etapeIdPath = etapeIdPathGet(
        etape.id,
        fichierNom,
        etape.contenu![sectionId][elementId],
        etape.heritageContenu![sectionId][elementId]
      )
    }
  }

  if (!etapeIdPath) {
    throw new Error('fichier inexistant')
  }
  const repertoire = 'demarches' as IDocumentRepertoire

  const filePath = `${repertoire}/${etapeIdPath}/${fichierNom}`

  return {
    nom: fichierNom.slice(5),
    format: 'pdf' as IFormat,
    filePath
  }
}

export { fichier, etapeFichier }
