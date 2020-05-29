import { IDocument, IToken } from '../../../types'

import { join } from 'path'
import * as cryptoRandomString from 'crypto-random-string'

import { debug } from '../../../config/index'
import fileDelete from '../../../tools/file-delete'
import fileStreamCreate from '../../../tools/file-stream-create'
import { permissionCheck } from '../../../tools/permission'

import {
  documentGet,
  documentCreate,
  documentUpdate,
  documentDelete
} from '../../../database/queries/documents'

import { userGet } from '../../../database/queries/utilisateurs'
import { documentTypeGet } from '../../../database/queries/metas'

import DocumentUpdationValidate from '../../../business/titre-document-updation-validate'
import dirCreate from '../../../tools/dir-create'

const documentValidate = (document: IDocument) => {
  const errors = []

  if (!document.typeId) {
    errors.push('type de fichier manquant')
  }

  if (document.fichierNouveau && !document.fichierTypeId) {
    errors.push('extension du fichier manquante')
  }

  return errors
}

const documentCreer = async (
  { document }: { document: IDocument },
  context: IToken
) => {
  try {
    const user = context.user && (await userGet(context.user.id))
    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (
      !document.titreEtapeId &&
      !document.titreActiviteId &&
      !document.entrepriseId
    ) {
      throw new Error("id d'étape, d'activité ou d'entreprise manquant")
    }

    const documentType = await documentTypeGet(document.typeId)
    if (!documentType) {
      throw new Error('type de document incorrect')
    }

    const errors = documentValidate(document)

    const rulesErrors = await DocumentUpdationValidate(document)

    if (errors.length || rulesErrors.length) {
      throw new Error(errors.concat(rulesErrors).join(', '))
    }

    const hash = cryptoRandomString({ length: 8 })

    document.id = `${document.date}-${document.typeId}-${hash}`

    if (document.fichierNouveau) {
      const { createReadStream } = await document.fichierNouveau.file

      const dossier =
        document.titreEtapeId ||
        document.titreActiviteId ||
        document.entrepriseId

      const repertoire = documentType.repertoire

      await dirCreate(`${repertoire}/${dossier}`)

      await fileStreamCreate(
        createReadStream(),
        join(
          process.cwd(),
          `files/${repertoire}/${dossier}/${document.id}.${document.fichierTypeId}`
        )
      )

      document.fichier = true
    }

    delete document.fichierNouveau

    const documentUpdated = await documentCreate(document)

    return documentUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const documentModifier = async (
  { document }: { document: IDocument },
  context: IToken
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const errors = documentValidate(document)
    const rulesErrors = await DocumentUpdationValidate(document)

    if (errors.length || rulesErrors.length) {
      const e = errors.concat(rulesErrors)
      throw new Error(e.join(', '))
    }

    if (document.fichierNouveau || !document.fichier) {
      const documentOld = await documentGet(document.id, {}, user.id)

      if (!documentOld) {
        throw new Error('aucun document avec cette id')
      }

      if (documentOld.fichier) {
        const documentOldPath = `files/${documentOld.id}.${documentOld.fichierTypeId}`

        try {
          await fileDelete(join(process.cwd(), documentOldPath))
        } catch (e) {
          console.info(`impossible de supprimer le fichier: ${documentOldPath}`)
        }
      }
    }

    if (document.fichierNouveau) {
      const { createReadStream } = await document.fichierNouveau.file

      await fileStreamCreate(
        createReadStream(),
        join(process.cwd(), `files/${document.id}.${document.fichierTypeId}`)
      )

      document.fichier = true
    }

    delete document.fichierNouveau

    const documentUpdated = await documentUpdate(document.id, document)

    return documentUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const documentSupprimer = async ({ id }: { id: string }, context: IToken) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const documentOld = await documentGet(id, {}, user.id)

    if (!documentOld) {
      throw new Error('aucun document avec cette id')
    }

    if (documentOld.fichier) {
      const documentOldPath = `files/${documentOld.id}.${documentOld.fichierTypeId}`

      try {
        await fileDelete(join(process.cwd(), documentOldPath))
      } catch (e) {
        console.info(`impossible de supprimer le fichier: ${documentOldPath}`)
      }
    }

    await documentDelete(id)

    return null
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { documentCreer, documentModifier, documentSupprimer }
