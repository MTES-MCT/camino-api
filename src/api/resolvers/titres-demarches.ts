import {
  IToken,
  IDemarcheType,
  ITitreDemarche,
  ITitreDemarcheInput
} from '../../types'
import { debug } from '../../config/index'

import metas from '../../database/cache/metas'

import { permissionsCheck } from './permissions/permissions-check'
import { titrePermissionAdministrationsCheck } from './permissions/titre'

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

const demarcheInputConvert = (demarcheInput: ITitreDemarcheInput) =>
  ({
    id: demarcheInput.id,
    typeId: demarcheInput.typeId,
    titreId: demarcheInput.titreId
  } as ITitreDemarche)

const titreDemarchesTypes = async (
  {
    titreId,
    demarcheTypeId = null
  }: { titreId: string; demarcheTypeId: string | null },
  context: IToken
) => {
  if (!context.user) throw new Error('droits insuffisants')

  const titre = await titreGet(titreId, {
    graph: '[administrationsGestionnaires, administrationsLocales, demarches]'
  })

  const type = metas.titresTypes.find(t => t.id === titre.typeId)

  if (!type) throw new Error(`${titre.typeId} inexistant`)

  const user = context.user && (await utilisateurGet(context.user.id))

  const isSuper = permissionsCheck(user, ['super'])

  titre.editable =
    isSuper ||
    titrePermissionAdministrationsCheck(
      user,
      'modification',
      titre.typeId,
      titre.statutId!,
      titre.administrationsGestionnaires,
      titre.administrationsLocales
    )

  return type.demarchesTypes!.reduce((demarchesTypes: IDemarcheType[], dt) => {
    // si
    // - le param demarcheTypeId n'existe pas (-> création d'une démarche)
    //   ou si ce param est différent de celui du type de démarche
    // - le type démarche est unique
    // - une autre démarche du même type existe au sein du titre
    // alors
    // - on ne l'ajoute pas à la liste des types de démarches disponibles
    if (
      (!demarcheTypeId || dt.id !== demarcheTypeId) &&
      dt.unique &&
      titre.demarches &&
      titre.demarches.find(d => d.typeId === dt.id)
    ) {
      return demarchesTypes
    }

    dt = demarcheTypeFormat(user, dt, titre, { isSuper })

    if (dt.editable) {
      dt.titreTypeId = titre.typeId
      demarchesTypes.push(dt)
    }

    return demarchesTypes
  }, [])
}

const demarcheCreer = async (
  { demarche: demarcheInput }: { demarche: ITitreDemarcheInput },
  context: IToken
) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (permissionsCheck(user, ['admin'])) {
      const titre = await titreGet(demarcheInput.titreId, { graph: '' })
      if (!titre) throw new Error("le titre n'existe pas")

      if (
        !titrePermissionAdministrationsCheck(
          user,
          'modification',
          titre.typeId,
          titre.statutId!,
          titre.administrationsGestionnaires,
          titre.administrationsLocales
        )
      ) {
        throw new Error('droits insuffisants pour créer cette démarche')
      }
    }

    const demarche = demarcheInputConvert(demarcheInput)

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
  { demarche: demarcheInput }: { demarche: ITitreDemarcheInput },
  context: IToken
) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (permissionsCheck(user, ['admin'])) {
      const titre = await titreGet(demarcheInput.titreId, { graph: '' })
      if (!titre) throw new Error("le titre n'existe pas")

      if (
        !titrePermissionAdministrationsCheck(
          user,
          'modification',
          titre.typeId,
          titre.statutId!,
          titre.administrationsGestionnaires,
          titre.administrationsLocales
        )
      ) {
        throw new Error('droits insuffisants pour modifier cette démarche')
      }
    }

    const demarche = demarcheInputConvert(demarcheInput)

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
