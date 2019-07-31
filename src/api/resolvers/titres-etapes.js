import { debug } from '../../config/index'
import permissionsCheck from './_permissions-check'

import {
  titreEtapeGet,
  titreEtapeUpsert,
  titreEtapeDelete
} from '../../database/queries/titres-etapes'

import titreEtapeUpdateTask from '../../business/titre-etape-update'

import titreEtapeUpdationValidate from '../../business/titre-etape-updation-validate'

const titreEtapeCreer = async ({ etape }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const rulesError = await titreEtapeUpdationValidate(etape)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    const etapeUpdated = await titreEtapeUpsert(etape)

    const titreUpdated = await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId
    )

    return titreUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreEtapeModifier = async ({ etape }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const rulesError = await titreEtapeUpdationValidate(etape)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    const etapeUpdated = await titreEtapeUpsert(etape)

    const titreUpdated = await titreEtapeUpdateTask(
      etapeUpdated.id,
      etapeUpdated.titreDemarcheId
    )

    return titreUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreEtapeSupprimer = async ({ id }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  try {
    const etapeOld = await titreEtapeGet(id)

    await titreEtapeDelete(id)

    const titreUpdated = await titreEtapeUpdateTask(
      null,
      etapeOld.titreDemarcheId
    )

    return titreUpdated
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { titreEtapeCreer, titreEtapeModifier, titreEtapeSupprimer }
