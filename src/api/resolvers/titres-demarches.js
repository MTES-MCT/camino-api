import { debug } from '../../config/index'

import metas from './_metas'

import { permissionsCheck } from './permissions/permissions-check'
import { titreModificationPermissionAdministrationsCheck } from './permissions/titre'

import { titreFormat, demarcheTypeFormat } from './format/titres'

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

const titreDemarchesTypes = async (
  { titreId, demarcheTypeId = null },
  context
) => {
  if (!context.user) return []

  const titre = await titreGet(titreId, {
    graph: '[administrationsGestionnaires, administrationsLocales, demarches]'
  })

  const isSuper = permissionsCheck(context.user, ['super'])

  const user = !isSuper && (await utilisateurGet(context.user.id))

  const type = metas.titresTypes.find(t => t.id === titre.typeId)
  if (!type) throw new Error(`${titre.typeId} inexistant`)

  titre.editable =
    isSuper || titreModificationPermissionAdministrationsCheck(titre, user)

  return type.demarchesTypes.reduce((demarchesTypes, dt) => {
    // si
    // - le param demarcheTypeId n'existe pas (-> création d'une démarche)
    //   ou si ce param est différent de celui du type de démarche
    // - le type démarche est unique
    // - une autre démarche du même type existe au sein du titre
    // alors
    // - on ne l'ajoute pas à la liste des types de démarches disponibles
    if (
      (!demarcheTypeId || dt.demarcheTypeId !== demarcheTypeId) &&
      dt.unique &&
      titre.demarches.find(d => d.typeId === dt.demarcheTypeId)
    ) {
      return demarchesTypes
    }

    dt = demarcheTypeFormat(dt, titre, user, { isSuper })

    if (dt.editable) {
      dt.titreTypeId = titre.typeId
      demarchesTypes.push(dt)
    }

    return demarchesTypes
  }, [])
}

const demarcheCreer = async ({ demarche }, context) => {
  try {
    if (!permissionsCheck(context.user, ['super', 'admin'])) {
      throw new Error('opération impossible')
    }

    let user

    if (permissionsCheck(context.user, ['admin'])) {
      const titre = await titreGet(demarche.titreId, { graph: null })
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

const demarcheModifier = async ({ demarche }, context) => {
  try {
    if (!permissionsCheck(context.user, ['super', 'admin'])) {
      throw new Error('opération impossible')
    }

    let user

    if (permissionsCheck(context.user, ['admin'])) {
      const titre = await titreGet(demarche.titreId, { graph: null })
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

const demarcheSupprimer = async ({ id }, context) => {
  try {
    if (!permissionsCheck(context.user, ['super'])) {
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

export {
  titreDemarchesTypes,
  demarcheCreer,
  demarcheModifier,
  demarcheSupprimer
}
