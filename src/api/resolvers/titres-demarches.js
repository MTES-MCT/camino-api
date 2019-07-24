import * as cryptoRandomString from 'crypto-random-string'
import { debug } from '../../config/index'
import permissionsCheck from './_permissions-check'

import {
  titreDemarcheGet,
  titreDemarcheCreate,
  titreDemarcheUpdate,
  titreDemarcheDelete
} from '../../database/queries/titres-demarches'

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
    demarche.id = cryptoRandomString({ length: 6 })
    const demarcheUpdated = await titreDemarcheCreate(demarche)
    const titreUpdated = await titreDemarcheUpdateTask(demarcheUpdated.titreId)

    return titreUpdated
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

    return titreUpdated
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

    return titreUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { titreDemarcheCreer, titreDemarcheModifier, titreDemarcheSupprimer }
