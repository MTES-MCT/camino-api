import { IDocument, IToken } from '../../../types'

import { join } from 'path'
import * as cryptoRandomString from 'crypto-random-string'

import { debug } from '../../../config/index'
import fileDelete from '../../../tools/file-delete'
import fileStreamCreate from '../../../tools/file-stream-create'
import { permissionCheck } from '../../../tools/permission'
import dirCreate from '../../../tools/dir-create'

import {
  documentsGet,
  documentGet,
  documentCreate,
  documentUpdate,
  documentDelete
} from '../../../database/queries/documents'

import { userGet } from '../../../database/queries/utilisateurs'
import { documentTypeGet } from '../../../database/queries/metas'

import documentUpdationValidate from '../../../business/document-updation-validate'
import fieldsBuild from './_fields-build'
import { GraphQLResolveInfo } from 'graphql-upload/node_modules/graphql'

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

const documents = async (
  { entreprisesIds }: { entreprisesIds?: string[] },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))
    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const fields = fieldsBuild(info)
    const documents = await documentsGet(
      { entreprisesIds },
      { fields },
      user.id
    )

    return documents
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
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

    const rulesErrors = await documentUpdationValidate(document)

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

      const dirPath = `files/${repertoire}/${dossier}`

      await dirCreate(dirPath)

      const filePath = `${dirPath}/${document.id}.${document.fichierTypeId}`

      await fileStreamCreate(createReadStream(), join(process.cwd(), filePath))

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

    const documentType = await documentTypeGet(document.typeId)
    if (!documentType) {
      throw new Error('type de document incorrect')
    }

    const errors = documentValidate(document)
    const rulesErrors = await documentUpdationValidate(document)

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
        const dossier =
          documentOld.titreEtapeId ||
          documentOld.titreActiviteId ||
          documentOld.entrepriseId

        const dirPath = `files/${documentOld.type!.repertoire}/${dossier}`

        const documentOldPath = `${dirPath}/${documentOld.id}.${documentOld.fichierTypeId}`

        try {
          await fileDelete(join(process.cwd(), documentOldPath))
        } catch (e) {
          console.info(`impossible de supprimer le fichier: ${documentOldPath}`)
        }
      }
    }

    if (document.fichierNouveau) {
      const dossier =
        document.titreEtapeId ||
        document.titreActiviteId ||
        document.entrepriseId

      const dirPath = `files/${documentType!.repertoire}/${dossier}`

      const { createReadStream } = await document.fichierNouveau.file

      const documentPath = `${dirPath}/${document.id}.${document.fichierTypeId}`

      await fileStreamCreate(
        createReadStream(),
        join(process.cwd(), documentPath)
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
      const dossier =
        documentOld.titreEtapeId ||
        documentOld.titreActiviteId ||
        documentOld.entrepriseId

      const dirPath = `files/${documentOld.type!.repertoire}/${dossier}`

      const documentOldPath = `${dirPath}/${documentOld.id}.${documentOld.fichierTypeId}`

      try {
        await fileDelete(join(process.cwd(), documentOldPath))
      } catch (e) {
        console.info(`impossible de supprimer le fichier: ${documentOldPath}`)
      }
    }

    await documentDelete(id)

    return true
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { documents, documentCreer, documentModifier, documentSupprimer }
