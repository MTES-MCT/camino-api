import { debug } from '../../config/index'
import { permissionsCheck } from './_permissions-check'
import { titreFormat } from './_titre-format'

import { titreModificationPermissionAdministrationsCheck } from './_titre'

import {
  titreDemarcheGet,
  titreDemarcheCreate,
  titreDemarcheUpdate,
  titreDemarcheDelete
} from '../../database/queries/titres-demarches'
import { titreGet } from '../../database/queries/titres'
import { utilisateurGet } from '../../database/queries/utilisateurs'
import { administrationsGet } from '../../database/queries/administrations'

import titreDemarcheUpdateTask from '../../business/titre-demarche-update'
import titreDemarcheUpdationValidate from '../../business/titre-demarche-updation-validate'

const titreDemarcheCreer = async ({ demarche }, context, info) => {
  try {
    if (!context.user || !permissionsCheck(context.user, ['super', 'admin'])) {
      throw new Error('opération impossible')
    }

    let user

    if (permissionsCheck(context.user, ['admin'])) {
      const titre = await titreGet(demarche.titreId, { eager: null })
      if (!titre) throw new Error("le titre n'existe pas")

      const administrations = await administrationsGet()

      user = await utilisateurGet(context.user.id)

      if (
        !titreModificationPermissionAdministrationsCheck(
          titre,
          user,
          administrations
        )
      ) {
        throw new Error('droits insuffisants pour créer cette démarche')
      }
    }

    const rulesErrors = await titreDemarcheUpdationValidate(demarche)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    const demarcheUpdated = await titreDemarcheCreate(demarche)
    const titreUpdated = await titreDemarcheUpdateTask(demarcheUpdated.titreId)

    if (!user) {
      user = await utilisateurGet(context.user.id)
    }

    return titreFormat(titreUpdated, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreDemarcheModifier = async ({ demarche }, context, info) => {
  try {
    if (!context.user || !permissionsCheck(context.user, ['super', 'admin'])) {
      throw new Error('opération impossible')
    }

    let user

    if (permissionsCheck(context.user, ['admin'])) {
      const titre = await titreGet(demarche.titreId, { eager: null })
      if (!titre) throw new Error("le titre n'existe pas")

      const administrations = await administrationsGet()

      user = await utilisateurGet(context.user.id)

      if (
        !titreModificationPermissionAdministrationsCheck(
          titre,
          user,
          administrations
        )
      ) {
        throw new Error('droits insuffisants pour modifier cette démarche')
      }
    }

    const rulesErrors = await titreDemarcheUpdationValidate(demarche)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    const demarcheUpdated = await titreDemarcheUpdate(demarche.id, demarche)
    const titreUpdated = await titreDemarcheUpdateTask(demarcheUpdated.titreId)

    if (!user) {
      user = await utilisateurGet(context.user.id)
    }

    return titreFormat(titreUpdated, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreDemarcheSupprimer = async ({ id }, context, info) => {
  try {
    if (!context.user || !permissionsCheck(context.user, ['super'])) {
      throw new Error('opération impossible')
    }

    // TODO: ajouter une validation ?

    const demarcheOld = await titreDemarcheGet(id)
    if (!demarcheOld) throw new Error("la démarche n'existe pas")

    await titreDemarcheDelete(id)

    const titreUpdated = await titreDemarcheUpdateTask(demarcheOld.titreId)

    const user = await utilisateurGet(context.user.id)

    return titreFormat(titreUpdated, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { titreDemarcheCreer, titreDemarcheModifier, titreDemarcheSupprimer }
