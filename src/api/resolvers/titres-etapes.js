import { debug } from '../../config/index'
import permissionsCheck from './_permissions-check'

import {
  titreEtapeUpsert,
  titreEtapeDelete
} from '../../database/queries/titres-etapes'

import titreEtapeUpdateTask from '../../tasks/titre-etape-update'

import titreEtapeUpdateValidation from '../../tasks/titre-etape-update-validation'

const titreEtapeModifier = async ({ etape }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const rulesError = await titreEtapeUpdateValidation(etape)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    const etapeNew = await titreEtapeUpsert(etape)

    const titreNew = await titreEtapeUpdateTask(
      etapeNew.id,
      etapeNew.titreDemarcheId
    )

    return titreNew
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

  return titreEtapeDelete(id)
}

export { titreEtapeModifier, titreEtapeSupprimer }
