import { join } from 'path'
import * as cryptoRandomString from 'crypto-random-string'

import { debug } from '../../../config/index'
import fileDelete from '../../../tools/file-delete'
import fileStreamCreate from '../../../tools/file-stream-create'
import { permissionCheck } from '../../../tools/permission'
import { titreFormat } from '../../_format/titres'

import {
  titreDocumentGet,
  titreDocumentCreate,
  titreDocumentUpdate,
  titreDocumentDelete
} from '../../../database/queries/titres-documents'

import { titreGet } from '../../../database/queries/titres'

import { userGet } from '../../../database/queries/utilisateurs'

import titreDocumentUpdationValidate from '../../../business/titre-document-updation-validate'
import { ITitreDocument, IToken } from '../../../types'
import { GraphQLResolveInfo } from 'graphql'
import fieldsBuild from './_fields-build'

const documentValidate = (document: ITitreDocument) => {
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
  { document }: { document: ITitreDocument },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))
    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const errors = documentValidate(document)

    const rulesErrors = await titreDocumentUpdationValidate(document)

    if (errors.length || rulesErrors.length) {
      const e = errors.concat(rulesErrors)
      throw new Error(e.join(', '))
    }

    document.id = `${document.titreEtapeId}-${
      document.typeId
    }-${cryptoRandomString({
      length: 8
    })}`

    if (document.fichierNouveau) {
      const { createReadStream } = await document.fichierNouveau.file

      await fileStreamCreate(
        createReadStream(),
        join(process.cwd(), `files/${document.id}.${document.fichierTypeId}`)
      )

      document.fichier = true
    }

    delete document.fichierNouveau

    const documentUpdated = await titreDocumentCreate(document)

    const fields = fieldsBuild(info)

    // todo: récupérer le titre autrement qu'en SLICANT l'id
    const titreId = documentUpdated.titreEtapeId.slice(0, -12)

    const titreUpdated = await titreGet(
      titreId,
      { fields },
      user.id
    )

    if (!titreUpdated) {
      throw new Error(`Le titre ${titreId} n'existe plus`)
    }

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const documentModifier = async (
  { document }: { document: ITitreDocument },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const errors = documentValidate(document)
    const rulesErrors = await titreDocumentUpdationValidate(document)

    if (errors.length || rulesErrors.length) {
      const e = errors.concat(rulesErrors)
      throw new Error(e.join(', '))
    }

    if (document.fichierNouveau || !document.fichier) {
      const documentOld = await titreDocumentGet(document.id)

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

    const documentUpdated = await titreDocumentUpdate(document.id, document)

    const fields = fieldsBuild(info)

    // todo: récupérer le titre autrement qu'en SLICANT l'id
    const titreId = documentUpdated.titreEtapeId.slice(0, -12)

    const titreUpdated = await titreGet(
      titreId,
      { fields },
      user.id
    )

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const documentSupprimer = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    const documentOld = await titreDocumentGet(id)

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

    await titreDocumentDelete(id)

    const fields = fieldsBuild(info)

    // todo: récupérer le titre autrement qu'en SLICANT l'id
    const titreId = documentOld.titreEtapeId.slice(0, -12)

    const titreUpdated = await titreGet(
      titreId,
      { fields },
      user.id
    )

    return titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { documentCreer, documentModifier, documentSupprimer }
