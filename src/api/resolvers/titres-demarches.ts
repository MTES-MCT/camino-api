import {
  IToken,
  ITitreDemarche,
  ITitreEtapeFiltre,
  ITitreDemarcheColonneInput
} from '../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../config/index'

import fieldsBuild from './_fields-build'
import metas from '../../database/cache/metas'

import { permissionsCheck } from './permissions/permissions-check'
import { titreDemarchePermissionAdministrationsCheck } from './permissions/titre-edition'

import { titreFormat } from './format/titres'

import { demarchesTypesFormat } from './format/demarches-types'
import { titreDemarcheFormat } from './format/titres-demarches'

import {
  titreDemarcheGet,
  titresDemarchesCount,
  titresDemarchesGet,
  titreDemarcheCreate,
  titreDemarcheUpdate,
  titreDemarcheDelete
} from '../../database/queries/titres-demarches'
import { titreGet } from '../../database/queries/titres'
import { userGet } from '../../database/queries/utilisateurs'

import titreDemarcheUpdateTask from '../../business/titre-demarche-update'
import titreDemarcheUpdationValidate from '../../business/titre-demarche-updation-validate'

const demarches = async (
  {
    page,
    intervalle,
    ordre,
    colonne,
    typesIds,
    statutsIds,
    titresTypesIds,
    titresDomainesIds,
    titresStatutsIds,
    etapesInclues,
    etapesExclues
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: ITitreDemarcheColonneInput | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    titresTypesIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresStatutsIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    if (!intervalle) {
      intervalle = 200
    }

    if (!page) {
      page = 1
    }
    const userId = context.user && context.user.id

    const titresDemarches = await titresDemarchesGet(
      {
        intervalle,
        page,
        ordre,
        colonne,
        typesIds,
        statutsIds,
        titresTypesIds,
        titresDomainesIds,
        titresStatutsIds,
        etapesInclues,
        etapesExclues
      },
      { fields: fields.demarches },
      userId
    )

    const total = await titresDemarchesCount(
      {
        typesIds,
        statutsIds,
        titresTypesIds,
        titresDomainesIds,
        titresStatutsIds,
        etapesInclues,
        etapesExclues
      },
      { fields: fields.demarches },
      userId
    )

    const user = context.user && (await userGet(context.user.id))

    const isSuper = permissionsCheck(user, ['super'])

    return {
      demarches: titresDemarches.map(titreDemarche =>
        titreDemarcheFormat(
          user,
          titreDemarche,
          titreDemarche.titre!.typeId,
          titreDemarche.titre!.statutId!,
          titreDemarche.titre!.amodiataires!,
          titreDemarche.titre!.titulaires!,
          { isSuper },
          fields
        )
      ),
      total
    }
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreDemarchesTypes = async (
  {
    titreId,
    demarcheTypeId = null
  }: { titreId: string; demarcheTypeId: string | null },
  context: IToken
) => {
  try {
    if (!context.user) throw new Error('droits insuffisants')

    const titre = await titreGet(
      titreId,
      { fields: { demarches: { id: {} } } },
      context.user?.id
    )
    if (!titre) return []

    const titreType = metas.titresTypes.find(t => t.id === titre.typeId)
    if (!titreType || !titreType.demarchesTypes) {
      throw new Error(`${titre.typeId} inexistant`)
    }

    const user = context.user && (await userGet(context.user.id))

    return demarchesTypesFormat(
      user,
      titreType.demarchesTypes,
      demarcheTypeId,
      titre
    )
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const demarcheCreer = async (
  { demarche }: { demarche: ITitreDemarche },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (permissionsCheck(user, ['admin'])) {
      const titre = await titreGet(demarche.titreId, {}, user.id)
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
    const titreUpdatedId = await titreDemarcheUpdateTask(
      demarcheUpdated.titreId
    )

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

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
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (permissionsCheck(user, ['admin'])) {
      const titre = await titreGet(demarche.titreId, {}, user.id)
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
    const titreUpdatedId = await titreDemarcheUpdateTask(
      demarcheUpdated.titreId
    )

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

    return titreUpdated && titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const demarcheSupprimer = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super'])) {
      throw new Error('droits insuffisants')
    }

    // TODO: ajouter une validation ?

    const demarcheOld = await titreDemarcheGet(
      id,
      { fields: {} },
      user && user.id
    )
    if (!demarcheOld) throw new Error("la démarche n'existe pas")

    await titreDemarcheDelete(id)

    const titreUpdatedId = await titreDemarcheUpdateTask(demarcheOld.titreId)

    const fields = fieldsBuild(info)

    const titreUpdated = await titreGet(titreUpdatedId, { fields }, user.id)

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
  demarches,
  demarcheCreer,
  demarcheModifier,
  demarcheSupprimer
}
