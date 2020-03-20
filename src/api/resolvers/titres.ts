import { IToken, ITitre, ITitreColonneInput } from '../../types'
import { GraphQLResolveInfo } from 'graphql'
import { debug } from '../../config/index'
import { permissionsCheck } from './permissions/permissions-check'
import { titreFormat, titresFormat } from './format/titres'
import { titresSortAndLimit } from './sort/titres'

import { titrePermissionAdministrationsCheck } from './permissions/titre-edition'

import fieldsBuild from './_fields-build'

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
    const fields = fieldsBuild(info)

    const titre = await titreGet(id, { fields }, context.user?.id)
    if (!titre) return null

    const user = context.user && (await utilisateurGet(context.user.id))

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
    intervalle,
    page,
    colonne,
    ordre,
    typesIds,
    domainesIds,
    statutsIds,
    substances,
    noms,
    entreprises,
    references,
    territoires
  }: {
    intervalle?: number | null
    page?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: ITitreColonneInput | 'activitesTotal' | null
    typesIds: string[]
    domainesIds: string[]
    statutsIds: string[]
    substances: string
    noms: string
    entreprises: string
    references: string
    territoires: string
  },
  context: IToken,
  info: GraphQLResolveInfo
) => {
  try {
    const fields = fieldsBuild(info)

    let activitesSortParams = null

    if (colonne === 'activitesTotal') {
      activitesSortParams = { intervalle, page, ordre }

      colonne = null
      intervalle = null
      page = null
      ordre = null
    }

    const titres = await titresGet(
      {
        intervalle,
        page,
        ordre,
        colonne,
        typesIds,
        domainesIds,
        statutsIds,
        substances,
        noms,
        entreprises,
        references,
        territoires
      },
      { fields },
      context.user?.id
    )

    const user = context.user && (await utilisateurGet(context.user.id))
    const titresFormatted = titres && titresFormat(user, titres, fields)

    return titresFormatted && activitesSortParams
      ? titresSortAndLimit(titresFormatted, activitesSortParams)
      : titresFormatted
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreCreer = async (
  { titre }: { titre: ITitre },
  context: IToken,
  info: GraphQLResolveInfo
) => {
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

    const titreUpdatedId = await titreUpdateTask(titre.id)

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

const titreModifier = async (
  { titre }: { titre: ITitre },
  context: IToken,
  info: GraphQLResolveInfo
) => {
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

    const titreOld = await titreGet(titre.id, {}, user.id)

    const rulesErrors = await titreUpdationValidate(titre, titreOld)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    await titreUpsert(titre)

    const titreUpdatedId = await titreUpdateTask(titre.id)

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

const titreSupprimer = async ({ id }: { id: string }, context: IToken) => {
  const user = context.user && (await utilisateurGet(context.user.id))

  if (!user || !permissionsCheck(user, ['super'])) {
    throw new Error('droits insuffisants')
  }

  return titreDelete(id)
}

export { titre, titres, titreCreer, titreModifier, titreSupprimer }
