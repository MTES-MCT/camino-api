import { debug } from '../../config/index'
import { permissionsCheck } from './permissions/permissions-check'
import { titreFormat, titresFormat } from './format/titre'

import {
  titreCreationPermissionAdministrationsCheck,
  titreModificationPermissionAdministrationsCheck
} from './permissions/titre'

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
import { administrationsGet } from '../../database/queries/administrations'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import titreUpdateTask from '../../business/titre-update'

import titreUpdationValidate from '../../business/titre-updation-validate'

const titre = async ({ id }, context, info) => {
  try {
    const fields = graphFieldsBuild(info)

    const graph = graphBuild(fields, 'titre', graphFormat)

    const titreRes = await titreGet(id, { graph })

    if (!titreRes) return null

    const user = context.user && (await utilisateurGet(context.user.id))

    return titreFormat(titreRes, user, fields)
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
  },
  context,
  info
) => {
  try {
    const fields = graphFieldsBuild(info)
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
      {
        graph: graphBuild(fields, 'titres', graphFormat)
      }
    )

    const user = context.user && (await utilisateurGet(context.user.id))

    return titres && titresFormat(titres, user, fields)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreCreer = async ({ titre }, context, info) => {
  try {
    if (!permissionsCheck(context.user, ['super', 'admin'])) {
      throw new Error('opération impossible')
    }

    const user = await utilisateurGet(context.user.id)

    if (permissionsCheck(context.user, ['admin'])) {
      const administrations = await administrationsGet()

      if (
        !titreCreationPermissionAdministrationsCheck(
          titre,
          user,
          administrations
        )
      ) {
        throw new Error('droits insuffisants pour créer ce type de titre')
      }
    }

    await titreCreate(titre)

    const titreRes = titreUpdateTask(titre.id)

    return titreFormat(titreRes, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreModifier = async ({ titre }, context, info) => {
  try {
    if (!permissionsCheck(context.user, ['super', 'admin'])) {
      throw new Error('opération impossible')
    }

    const user = await utilisateurGet(context.user.id)

    if (permissionsCheck(context.user, ['admin'])) {
      const administrations = await administrationsGet()

      if (
        !titreModificationPermissionAdministrationsCheck(
          titre,
          user,
          administrations
        )
      ) {
        throw new Error('droits insuffisants pour modifier ce titre')
      }
    }

    const titreOld = await titreGet(titre.id)

    const rulesErrors = await titreUpdationValidate(titre, titreOld)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
    }

    await titreUpsert(titre)

    const titreRes = titreUpdateTask(titre.id)

    return titreFormat(titreRes, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreSupprimer = async ({ id }, context, info) => {
  if (!permissionsCheck(context.user, ['super'])) {
    throw new Error('opération impossible')
  }

  return titreDelete(id)
}

export { titre, titres, titreCreer, titreModifier, titreSupprimer }
