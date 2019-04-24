import permissionsCheck from './_permissions-check'

import {
  titreEtapeUpsert,
  titreEtapeDelete
} from '../../database/queries/titres-etapes'

import titreEtapeUpdateTask from '../../tasks/titre-etape-update'

import titreEtapeUpdateValidation from '../../tasks/titre-etape-validation'

const titreEtapeModifier = async ({ etape }, context, info) => {
  const errors = []
  const propsMandatory = ['date', 'typeId', 'statutId']

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    errors.push('opération impossible')
  }

  propsMandatory.forEach(p => {
    if (!etape[p]) {
      errors.push(`le champ ${p} est requis`)
    }
  })

  const rulesError = await titreEtapeUpdateValidation(etape)

  if (rulesError) {
    errors.push(rulesError)
  }

  if (errors.length) {
    throw new Error(errors.join(', '))
  }

  const res = await titreEtapeUpsert(etape)

  await titreEtapeUpdateTask(etape.id)

  return res
}

const titreEtapeSupprimer = async ({ id }, context, info) => {
  const errors = []

  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    errors.push('opération impossible')
  }

  if (errors.length) {
    throw new Error(errors.join(', '))
  }

  const res = await titreEtapeDelete(id)

  return res
}

export { titreEtapeModifier, titreEtapeSupprimer }
