import permissionsCheck from './_permissions-check'

import {
  titreDemarcheUpsert,
  titreDemarcheDelete
} from '../../database/queries/titres-demarches'

import titreDemarcheUpdateTask from '../../tasks/titre-demarche-update'

import titreDemarcheUpdateValidation from '../../tasks/titre-demarche-validation'

const titreDemarcheModifier = async ({ demarche }, context, info) => {
  const errors = []
  const propsMandatory = ['typeId', 'statutId']

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    errors.push('opération impossible')
  }

  propsMandatory.forEach(p => {
    if (!demarche[p]) {
      errors.push(`le champ ${p} est requis`)
    }
  })

  const rulesError = await titreDemarcheUpdateValidation(demarche)

  if (rulesError) {
    errors.push(rulesError)
  }

  if (errors.length) {
    throw new Error(errors.join(', '))
  }

  const res = await titreDemarcheUpsert(demarche)

  await titreDemarcheUpdateTask(demarche.id)

  return res
}

const titreDemarcheSupprimer = async ({ id }, context, info) => {
  const errors = []

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    errors.push('opération impossible')
  }

  if (errors.length) {
    throw new Error(errors.join(', '))
  }

  const res = await titreDemarcheDelete(id)

  return res
}

export { titreDemarcheModifier, titreDemarcheSupprimer }
