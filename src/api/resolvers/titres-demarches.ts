import {
  IToken,
  ITitreDemarche,
  ITitreEtapeFiltre,
  ITitreDemarcheColonneId
} from '../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../config/index'

import fieldsBuild from './_fields-build'

import { permissionCheck } from '../../tools/permission'
import { titreDemarchePermissionAdministrationsCheck } from './permissions/titre-edition'

import { titreFormat } from './format/titres'

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
    colonne?: ITitreDemarcheColonneId | null
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

    const userId = context.user?.id

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

    return {
      demarches: titresDemarches.map(titreDemarche =>
        titreDemarcheFormat(
          user,
          titreDemarche,
          titreDemarche.titre!.typeId,
          titreDemarche.titre!.statutId!,
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

const demarcheCreer = async (
  { demarche }: { demarche: ITitreDemarche },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await userGet(context.user.id))

    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (permissionCheck(user, ['admin'])) {
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
      demarcheUpdated.id,
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

    if (!user || !permissionCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (permissionCheck(user, ['admin'])) {
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
      demarcheUpdated.id,
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

    if (!user || !permissionCheck(user, ['super'])) {
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

    const titreUpdatedId = await titreDemarcheUpdateTask(null, demarcheOld.titreId)

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

export { demarches, demarcheCreer, demarcheModifier, demarcheSupprimer }
