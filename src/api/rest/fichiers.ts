import {
  IContenuElement,
  IContenuValeur,
  IDocumentRepertoire,
  IFormat
} from '../../types'

import { documentGet } from '../../database/queries/documents'
import { userGet } from '../../database/queries/utilisateurs'
import { titreEtapeGet } from '../../database/queries/titres-etapes'
import { documentRepertoireFind } from '../../tools/documents/document-repertoire-find'
import { documentFilePathFind } from '../../tools/documents/document-path-find'
import { debug } from '../../config/index'

import JSZip from 'jszip'
import { writeFile } from 'fs/promises'
import { statSync, readFileSync } from 'fs'

const etapeTelecharger = async (
  { params: { etapeId } }: { params: { etapeId?: string } },
  userId?: string
) => {
  if (!etapeId) {
    throw new Error("id d'étape absent")
  }

  const user = await userGet(userId)

  if (!user) {
    throw new Error("l'utilisateur n'existe pas")
  }

  const titreEtape = await titreEtapeGet(
    etapeId,
    {
      fields: {
        documents: {
          id: {}
        }
      }
    },
    user
  )

  if (!titreEtape) throw new Error("l'étape n'existe pas")

  const documents = titreEtape!.documents
  if (!documents || !documents.length) {
    throw new Error("aucun document n'a été trouvé pour cette demande")
  }

  const zip = new JSZip()

  for (let i = 0; i < documents!.length; i++) {
    const path = await documentFilePathFind(documents[i])
    const filename = path.split('/').pop()

    if (statSync(path).isFile()) {
      zip.file(filename!, readFileSync(path))
    }
  }

  const base64Data = await zip.generateAsync({ type: 'base64' })

  const nom = `documents-${etapeId}.zip`

  const filePath = `tmp/${nom}`

  try {
    await writeFile('files/' + filePath, base64Data, 'base64')

    return {
      nom,
      format: 'zip' as IFormat,
      filePath
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const fichier = async (
  { params: { documentId } }: { params: { documentId?: string } },
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
        entreprise: { id: {} }
      }
    },
    user
  )

  if (!document || !document.fichier) {
    throw new Error('fichier inexistant')
  }

  let dossier

  const repertoire = documentRepertoireFind(document)

  const format = 'pdf' as IFormat

  if (repertoire === 'demarches') {
    dossier = document.etape!.id
  } else if (repertoire === 'activites') {
    dossier = document.activite!.id
  } else if (repertoire === 'entreprises') {
    dossier = document.entreprise!.id
  }

  const nom = `${document.date}-${dossier ? dossier + '-' : ''}${
    document.typeId
  }.${format}`

  const filePath = `${repertoire}/${dossier ? dossier + '/' : ''}${
    document.id
  }.${document.fichierTypeId}`

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
  {
    params: { etapeId, fichierNom }
  }: { params: { etapeId?: string; fichierNom?: string } },
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

export { fichier, etapeFichier, etapeTelecharger }
