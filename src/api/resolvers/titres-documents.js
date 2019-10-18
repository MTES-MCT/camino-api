import { debug } from '../../config/index'
import permissionsCheck from './_permissions-check'
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

  console.log(document)

  const rulesError = await titreDocumentUpdationValidate(document)

  if (rulesError) {
    throw new Error(rulesError)
  }

  if (document.fichier) {
    const fichier = await context.upload(document.fichier)
    console.log('yyyy', fichier)
  }

  try {
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
