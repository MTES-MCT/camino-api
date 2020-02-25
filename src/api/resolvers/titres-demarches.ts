import { IToken, ITitreDemarche, ITitreEtapeFiltre } from '../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../config/index'

import graphFieldsBuild from './graph/fields-build'
import graphBuild from './graph/build'
import graphFormat from './graph/format'
import { titreFieldsAdd } from './graph/titre-fields-add'

import metas from '../../database/cache/metas'

import { permissionsCheck } from './permissions/permissions-check'
import { titreDemarchePermissionAdministrationsCheck } from './permissions/titre-edition'

import { titreFormat } from './format/titres'

import { demarchesTypesFormat } from './format/demarches-types'
import { titresDemarchesFormat } from './format/titres-demarches'

import {
  titreDemarcheGet,
  titresDemarchesGet,
  titreDemarcheCreate,
  titreDemarcheUpdate,
  titreDemarcheDelete
} from '../../database/queries/titres-demarches'
import { titreGet } from '../../database/queries/titres'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import titreDemarcheUpdateTask from '../../business/titre-demarche-update'
import titreDemarcheUpdationValidate from '../../business/titre-demarche-updation-validate'

const demarches = async (
  {
    pages,
    page,
    typeIds,
    statutIds,
    titresTypeIds,
    titresDomaineIds,
    titresStatutIds,
    etapesInclues,
    etapesExclues
  }: {
    pages?: number | null
    page?: number | null
    typeIds?: string[] | null
    statutIds?: string[] | null
    titresTypeIds?: string[] | null
    titresDomaineIds?: string[] | null
    titresStatutIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  let fields = graphFieldsBuild(info)
  fields = titreFieldsAdd(fields)

  if (!pages) {
    pages = 200
  }

  if (!page) {
    page = 1
  }

  const graph = graphBuild(fields, 'titre', graphFormat)

  const titresDemarches = await titresDemarchesGet(
    {
      pages,
      page,
      typeIds,
      statutIds,
      titresTypeIds,
      titresDomaineIds,
      titresStatutIds,
      etapesInclues,
      etapesExclues
    },
    { graph }
  )

  const user = context.user && (await utilisateurGet(context.user.id))

  const isSuper = permissionsCheck(user, ['super'])
  const isAdmin = permissionsCheck(user, ['admin'])

  return titresDemarchesFormat(
    user,
    titresDemarches,
    { isSuper, isAdmin },
    fields
  )
}

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
  if (!titreType || !titreType.demarchesTypes)
    throw new Error(`${titre.typeId} inexistant`)

  const user = context.user && (await utilisateurGet(context.user.id))

  return demarchesTypesFormat(
    user,
    titreType.demarchesTypes,
    demarcheTypeId,
    titre
  )
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
  demarches,
  demarcheCreer,
  demarcheModifier,
  demarcheSupprimer
}
