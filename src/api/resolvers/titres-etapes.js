import { debug } from '../../config/index'
import permissionsCheck from './_permissions-check'

import {
  titreEtapeGet,
  titreEtapeUpdate,
  titreEtapeDelete
} from '../../database/queries/titres-etapes'

import titreEtapeUpdateTask from '../../business/titre-etape-update'

import titreEtapeUpdateValidation from '../../business/titre-etape-update-validation'

const titreEtapeModifier = async ({ etape }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const rulesError = await titreEtapeUpdateValidation(etape)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    const etapeUpdated = await titreEtapeUpdate(etape.id, etape)

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

export { titreEtapeModifier, titreEtapeSupprimer }
