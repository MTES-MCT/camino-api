import { IToken, IDemarcheType, ITitreDemarche } from '../../types'
import { debug } from '../../config/index'

import metas from '../../database/cache/metas'

import { permissionsCheck } from './permissions/permissions-check'
import { titreDemarchePermissionAdministrationsCheck } from './permissions/titre-edition'

import { titreFormat, demarcheTypeFormat } from './format/titres'

import {
  titreDemarcheGet,
  titreDemarcheCreate,
  titreDemarcheUpdate,
  titreDemarcheDelete
} from '../../database/queries/titres-demarches'
import { titreGet } from '../../database/queries/titres'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import titreDemarcheUpdateTask from '../../business/titre-demarche-update'
import titreDemarcheUpdationValidate from '../../business/titre-demarche-updation-validate'

const titreDemarchesTypes = async (
  {
    titreId,
    demarcheTypeId = null
  }: { titreId: string; demarcheTypeId: string | null },
  context: IToken
) => {
  if (!context.user) throw new Error('droits insuffisants')

  const titre = await titreGet(titreId, { graph: '[demarches]' })

  const titreType = metas.titresTypes.find(t => t.id === titre.typeId)
  if (!titreType) throw new Error(`${titre.typeId} inexistant`)

  const user = context.user && (await utilisateurGet(context.user.id))

  return titreType.demarchesTypes!.reduce((demarchesTypes: IDemarcheType[], dt) => {
    // si
    // - le param demarcheTypeId n'existe pas (-> création d'une démarche)
    //   ou ce param est différent de celui du type de démarche et
    // - le type démarche est unique et
    // - une autre démarche du même type existe au sein du titre
    // alors
    // - on ne l'ajoute pas à la liste des types de démarches disponibles
    if (
      (!demarcheTypeId || dt.id !== demarcheTypeId) &&
      dt.unique &&
      titre.demarches?.find(d => d.typeId === dt.id)
    ) {
      return demarchesTypes
    }

    dt = demarcheTypeFormat(user, dt, titre.typeId, titre.statutId!)

    if (dt.editable) {
      dt.titreTypeId = titre.typeId
      demarchesTypes.push(dt)
    }

    return demarchesTypes
  }, [])
}

const demarcheCreer = async (
  { demarche }: { demarche: ITitreDemarche },
  context: IToken
) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (permissionsCheck(user, ['admin'])) {
      const titre = await titreGet(demarche.titreId, { graph: undefined })
      if (!titre) throw new Error("le titre n'existe pas")

      if (
        !titreDemarchePermissionAdministrationsCheck(
          user,
          titre.typeId,
          titre.statutId!
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

    return titreUpdated && titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const demarcheModifier = async (
  { demarche }: { demarche: ITitreDemarche },
  context: IToken
) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (permissionsCheck(user, ['admin'])) {
      const titre = await titreGet(demarche.titreId, { graph: undefined })
      if (!titre) throw new Error("le titre n'existe pas")

      if (
        !titreDemarchePermissionAdministrationsCheck(
          user,
          titre.typeId,
          titre.statutId!
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

    return titreUpdated && titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const demarcheSupprimer = async ({ id }: { id: string }, context: IToken) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!permissionsCheck(user, ['super'])) {
      throw new Error('droits insuffisants')
    }

    // TODO: ajouter une validation ?

    const demarcheOld = await titreDemarcheGet(id)
    if (!demarcheOld) throw new Error("la démarche n'existe pas")

    await titreDemarcheDelete(id)

    const titreUpdated = await titreDemarcheUpdateTask(demarcheOld.titreId)

    return titreUpdated && titreFormat(user, titreUpdated)
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
