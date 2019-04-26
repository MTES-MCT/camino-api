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

  const res = await titreDemarcheUpsert(demarche)

  await titreDemarcheUpdateTask(demarche.id)

  return res
}

const titreDemarcheSupprimer = async ({ id }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  return titreDemarcheDelete(id)
}

export { titreDemarcheModifier, titreDemarcheSupprimer }
