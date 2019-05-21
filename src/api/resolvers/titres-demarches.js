import { debug } from '../../config/index'
import permissionsCheck from './_permissions-check'

import {
  titreDemarcheUpsert,
  titreDemarcheDelete
} from '../../database/queries/titres-demarches'

import titreDemarcheUpdateTask from '../../tasks/titre-demarche-update'

import titreDemarcheUpdateValidation from '../../tasks/titre-demarche-update-validation'

const titreDemarcheModifier = async ({ demarche }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const rulesError = await titreDemarcheUpdateValidation(demarche)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    const demarcheNew = await titreDemarcheUpsert(demarche)

    const titreNew = await titreDemarcheUpdateTask(
      demarcheNew.id,
      demarcheNew.titreId
    )

    return titreNew
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

  try {
    const demarcheOld = await titreDemarcheDelete(id)

    const titreNew = await titreDemarcheUpdateTask(
      demarcheOld.id,
      demarcheOld.titreId
    )

    return titreNew
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { titreDemarcheModifier, titreDemarcheSupprimer }
