import { debug } from '../../config/index'
import permissionsCheck from './_permissions-check'
import { titreFormat } from './_titre-format'

import {
  titreDemarcheGet,
  titreDemarcheCreate,
  titreDemarcheUpdate,
  titreDemarcheDelete
} from '../../database/queries/titres-demarches'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import titreDemarcheUpdateTask from '../../business/titre-demarche-update'
import titreDemarcheUpdationValidate from '../../business/titre-demarche-updation-validate'

const titreDemarcheCreer = async ({ demarche }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const rulesError = await titreDemarcheUpdationValidate(demarche)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    const demarcheUpdated = await titreDemarcheCreate(demarche)
    const titreUpdated = await titreDemarcheUpdateTask(demarcheUpdated.titreId)

    const user = context.user && (await utilisateurGet(context.user.id))

    return titreFormat(titreUpdated, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreDemarcheModifier = async ({ demarche }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const rulesError = await titreDemarcheUpdationValidate(demarche)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    const demarcheUpdated = await titreDemarcheUpdate(demarche.id, demarche)
    const titreUpdated = await titreDemarcheUpdateTask(demarcheUpdated.titreId)

    const user = context.user && (await utilisateurGet(context.user.id))

    return titreFormat(titreUpdated, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreDemarcheSupprimer = async ({ id }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  // TODO / question: ajouter une validation ?

  try {
    const demarcheOld = await titreDemarcheGet(id)

    await titreDemarcheDelete(id)

    const titreUpdated = await titreDemarcheUpdateTask(demarcheOld.titreId)

    const user = context.user && (await utilisateurGet(context.user.id))

    return titreFormat(titreUpdated, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { titreDemarcheCreer, titreDemarcheModifier, titreDemarcheSupprimer }
