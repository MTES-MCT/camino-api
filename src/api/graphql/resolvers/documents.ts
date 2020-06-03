import { IDocument, IToken, IDocumentRepertoire } from '../../../types'
import { FileUpload } from 'graphql-upload'

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
  documentDelete,
  documentIdUpdate
} from '../../../database/queries/documents'

import { userGet } from '../../../database/queries/utilisateurs'
import { documentTypeGet } from '../../../database/queries/metas'

import documentUpdationValidate from '../../../business/document-updation-validate'
import fieldsBuild from './_fields-build'
import { GraphQLResolveInfo } from 'graphql-upload/node_modules/graphql'
import fileRename from '../../../tools/file-rename'

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

const documentFileDirPathFind = (
  document: IDocument,
  repertoire: IDocumentRepertoire
) =>
  `files/${repertoire}/${document.titreEtapeId ||
    document.titreActiviteId ||
    document.entrepriseId}`

const documentFilePathFind = (document: IDocument, dirPath: string) =>
  `${dirPath}/${document.id}.${document.fichierTypeId}`

const documentFileCreate = async (
  document: IDocument,
  repertoire: IDocumentRepertoire,
  fileUpload: FileUpload
) => {
  const dirPath = documentFileDirPathFind(document, repertoire)

  await dirCreate(dirPath)

  const documentFilePath = documentFilePathFind(document, dirPath)
  const { createReadStream } = await fileUpload

  await fileStreamCreate(
    createReadStream(),
    join(process.cwd(), documentFilePath)
  )
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
    if (!documentType.repertoire) {
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
      document.fichier = true

      await documentFileCreate(
        document,
        documentType.repertoire,
        document.fichierNouveau.file
      )
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

    const documentOld = await documentGet(document.id, {}, user.id)
    if (!documentOld) {
      throw new Error('aucun document avec cette id')
    }

    const documentType = await documentTypeGet(document.typeId)
    if (!documentType.repertoire) {
      throw new Error('type de document incorrect')
    }

    const errors = documentValidate(document)
    const rulesErrors = await documentUpdationValidate(document)

    if (errors.length || rulesErrors.length) {
      const e = errors.concat(rulesErrors)
      throw new Error(e.join(', '))
    }

    const documentFichierNouveau = document.fichierNouveau

    document.fichier = !!document.fichierNouveau

    // cette propriété qui vient du front n'existe pas en base
    delete document.fichierNouveau

    const documentUpdated = await documentUpdate(document.id, document)

    // si la date ou le type de fichier ont changé
    // alors on change l'id et renomme le fichier s'il y en a un
    if (
      document.date !== documentOld.date ||
      document.typeId !== documentOld.typeId
    ) {
      const hash = documentOld.id.split('-').pop()
      const documentIdNew = `${documentUpdated.date}-${documentUpdated.typeId}-${hash}`

      documentUpdated.id = documentIdNew

      await documentIdUpdate(documentOld.id, documentUpdated)

      if (!documentFichierNouveau && document.fichier && documentOld.fichier) {
        const dirPath = documentFileDirPathFind(
          documentUpdated,
          documentType.repertoire
        )

        const documentOldFilePath = documentFilePathFind(documentOld, dirPath)
        const documentFilePath = documentFilePathFind(documentUpdated, dirPath)

        await fileRename(documentOldFilePath, documentFilePath)
      }
    }

    // supprime de l'ancien fichier
    if (
      (documentFichierNouveau || !documentUpdated.fichier) &&
      documentOld.fichier
    ) {
      const dirPath = documentFileDirPathFind(
        documentOld,
        documentType.repertoire
      )
      const documentOldFilePath = documentFilePathFind(documentOld, dirPath)

      try {
        await fileDelete(join(process.cwd(), documentOldFilePath))
      } catch (e) {
        console.info(
          `impossible de supprimer le fichier: ${documentOldFilePath}`
        )
      }
    }

    // enregistre du nouveau fichier
    if (documentFichierNouveau) {
      await documentFileCreate(
        documentUpdated,
        documentType.repertoire,
        documentFichierNouveau.file
      )
    }

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
      const dirPath = documentFileDirPathFind(
        documentOld,
        documentOld.type!.repertoire
      )
      const documentOldFilePath = documentFilePathFind(documentOld, dirPath)

      try {
        await fileDelete(join(process.cwd(), documentOldFilePath))
      } catch (e) {
        console.info(
          `impossible de supprimer le fichier: ${documentOldFilePath}`
        )
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
