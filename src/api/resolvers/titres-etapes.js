import permissionsCheck from './_permissions-check'

import {
  titreEtapeUpsert,
  titreEtapeDelete
} from '../../database/queries/titres-etapes'

import titreEtapeUpdateTask from '../../tasks/titre-etape-update'

import titreEtapeUpdateValidation from '../../tasks/titre-etape-update-validation'

const titreEtapeModifier = async ({ etape }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('droits insuffisants pour effectuer la modification')
  }

  const rulesError = await titreEtapeUpdateValidation(etape)

  if (rulesError) {
    throw new Error(rulesError)
  }

  const etapeNew = await titreEtapeUpsert(etape)

  await titreEtapeUpdateTask(etapeNew.id, etapeNew.titreDemarcheId)

  return etapeNew
}

const titreEtapeSupprimer = async ({ id }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('droits insuffisants pour effectuer la modification')
  }

  return titreEtapeDelete(id)
}

export { titreEtapeModifier, titreEtapeSupprimer }
