import { IToken, ITitre } from '../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../config/index'
import { permissionsCheck } from './permissions/permissions-check'
import { titreFormat, titresFormat } from './format/titres'

import { titrePermissionAdministrationsCheck } from './permissions/titre-edition'

import graphFieldsBuild from './graph/fields-build'
import graphBuild from './graph/build'
import graphFormat from './graph/format'

import {
  titreCreate,
  titreDelete,
  titreGet,
  titresGet,
  titreUpsert
} from '../../database/queries/titres'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import titreUpdateTask from '../../business/titre-update'

import titreUpdationValidate from '../../business/titre-updation-validate'

const titre = async (
  { id }: { id: string },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))
    const fields = graphFieldsBuild(info)

    const graph = graphBuild(fields, 'titre', graphFormat)

    const titre = await titreGet(id, { graph })

    if (!titre) return null

    return titreFormat(user, titre, fields)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titres = async (
  {
    typeIds,
    domaineIds,
    statutIds,
    substances,
    noms,
    entreprises,
    references,
    territoires
  }: {
    typeIds: string[]
    domaineIds: string[]
    statutIds: string[]
    substances: string[]
    noms: string[]
    entreprises: string[]
    references: string[]
    territoires: string[]
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))
    const fields = graphFieldsBuild(info)
    const graph = graphBuild(fields, 'titres', graphFormat)
    const titres = await titresGet(
      {
        typeIds,
        domaineIds,
        statutIds,
        substances,
        noms,
        entreprises,
        references,
        territoires
      },
      { graph }
    )

    return titres && titresFormat(user, titres, fields)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreCreer = async ({ titre }: { titre: ITitre }, context: IToken) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (
      permissionsCheck(user, ['admin']) &&
      !titrePermissionAdministrationsCheck(user, titre.typeId, 'dmi')
    ) {
      throw new Error('droits insuffisants pour créer ce type de titre')
    }

    // insert le titre dans la base
    // ajoute l'id par effet de bord
    await titreCreate(titre)

    const titreUpdated = await titreUpdateTask(titre.id)

    return titreUpdated && titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreModifier = async ({ titre }: { titre: ITitre }, context: IToken) => {
  try {
    const user = context.user && (await utilisateurGet(context.user.id))

    if (!user || !permissionsCheck(user, ['super', 'admin'])) {
      throw new Error('droits insuffisants')
    }

    if (
      permissionsCheck(user, ['admin']) &&
      !titrePermissionAdministrationsCheck(user, titre.typeId, 'dmi')
    ) {
      throw new Error('droits insuffisants pour modifier ce titre')
    }

    const titreOld = await titreGet(titre.id)

    const rulesErrors = await titreUpdationValidate(titre, titreOld)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    await titreUpsert(titre)

    const titreUpdated = await titreUpdateTask(titre.id)

    return titreUpdated && titreFormat(user, titreUpdated)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreSupprimer = async ({ id }: { id: string }, context: IToken) => {
  const user = context.user && (await utilisateurGet(context.user.id))

  if (!user || !permissionsCheck(user, ['super'])) {
    throw new Error('droits insuffisants')
  }

  return titreDelete(id)
}

export { titre, titres, titreCreer, titreModifier, titreSupprimer }
