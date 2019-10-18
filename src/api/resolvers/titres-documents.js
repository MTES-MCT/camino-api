import { join } from 'path'
import * as cryptoRandomString from 'crypto-random-string'

import { debug } from '../../config/index'
import fileDelete from '../../tools/file-delete'
import fileStreamCreate from '../../tools/file-stream-create'
import { permissionsCheck } from './_permissions-check'
import { titreFormat } from './_titre-format'

import {
  titreDocumentGet,
  titreDocumentCreate,
  titreDocumentUpdate,
  titreDocumentDelete
} from '../../database/queries/titres-documents'

import { titreGet } from '../../database/queries/titres'

import { utilisateurGet } from '../../database/queries/utilisateurs'

import titreDocumentUpdationValidate from '../../business/titre-document-updation-validate'

const titreDocumentCreer = async ({ document }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const rulesError = await titreDocumentUpdationValidate(document)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    document.id = `${document.titreEtapeId}-${
      document.typeId
    }-${cryptoRandomString({
      length: 8
    })}`

    if (document.fichierNouveau) {
      const { createReadStream } = await document.fichierNouveau

      await fileStreamCreate(
        createReadStream(),
        join(process.cwd(), `files/${document.id}.pdf`)
      )

      document.fichier = document.id

      delete document.fichierNouveau
    }

    const documentUpdated = await titreDocumentCreate(document)

    const titreUpdated = await titreGet(
      documentUpdated.titreEtapeId.slice(0, -12)
    )

    const user = context.user && (await utilisateurGet(context.user.id))

    return titreFormat(titreUpdated, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreDocumentModifier = async ({ document }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const rulesError = await titreDocumentUpdationValidate(document)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    if (document.fichierNouveau || !document.fichier) {
      const documentOld = titreDocumentGet(document.id)
      if (documentOld.fichier) {
        await fileDelete(
          join(process.cwd(), `files/${documentOld.fichier}.pdf`)
        )
      }
    }

    if (document.fichierNouveau) {
      const { createReadStream } = await document.fichierNouveau

      await fileStreamCreate(
        createReadStream(),
        join(process.cwd(), `files/${document.id}.pdf`)
      )

      document.fichier = document.id

      delete document.fichierNouveau
    }

    const documentUpdated = await titreDocumentUpdate(document.id, document)

    const titreUpdated = await titreGet(
      documentUpdated.titreEtapeId.slice(0, -12)
    )

    const user = context.user && (await utilisateurGet(context.user.id))

    return titreFormat(titreUpdated, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreDocumentSupprimer = async ({ id }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  try {
    const documentOld = await titreDocumentGet(id)

    if (documentOld.fichier) {
      await fileDelete(join(process.cwd(), `files/${documentOld.fichier}.pdf`))
    }

    await titreDocumentDelete(id)

    const titreUpdated = await titreGet(documentOld.titreEtapeId.slice(0, -12))

    const user = context.user && (await utilisateurGet(context.user.id))

    return titreFormat(titreUpdated, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { titreDocumentCreer, titreDocumentModifier, titreDocumentSupprimer }
