import { debug } from '../../config/index'
import permissionsCheck from './_permissions-check'

import {
  titreDemarcheGet,
  titreDemarcheUpdate,
  titreDemarcheDelete
} from '../../database/queries/titres-demarches'

import titreDemarcheUpdateTask from '../../business/titre-demarche-update'

import titreDemarcheUpdateValidation from '../../business/titre-demarche-update-validation'

const titreDemarcheModifier = async ({ demarche }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const rulesError = await titreDemarcheUpdateValidation(demarche)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    const demarcheNew = await titreDemarcheUpdate(demarche.id, demarche)
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
    const demarcheOld = await titreDemarcheGet(id)

    await titreDemarcheDelete(id)

    const titreNew = await titreDemarcheUpdateTask(null, demarcheOld.titreId)

    return titreNew
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { titreDemarcheModifier, titreDemarcheSupprimer }
