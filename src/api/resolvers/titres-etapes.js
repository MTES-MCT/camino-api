import permissionsCheck from './_permissions-check'

import {
  titreEtapeUpsert,
  titreEtapeDelete
} from '../../database/queries/titres-etapes'

import titreEtapeUpdateTask from '../../tasks/titre-etape-update'

import titreEtapeUpdateValidation from '../../tasks/titre-etape-validation'

const titreEtapeModifier = async ({ etape }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('droits insuffisants pour effectuer la modification')
  }

  const rulesError = await titreEtapeUpdateValidation(etape)

  if (rulesError) {
    throw new Error(rulesError)
  }

  const res = await titreEtapeUpsert(etape)

  await titreEtapeUpdateTask(etape.id)

  return res
}

const titreEtapeSupprimer = async ({ id }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('droits insuffisants pour effectuer la modification')
  }

  return titreEtapeDelete(id)
}

export { titreEtapeModifier, titreEtapeSupprimer }
