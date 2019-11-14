import { debug } from '../../config/index'
import { permissionsCheck } from './_permissions-check'
import { titreFormat, titresFormat } from './_titre-format'

import { titrePermissionAdministrationsCheck } from './_titre'

import fieldsBuild from './_fields-build'
import eagerBuild from './_eager-build'
import titreEagerFormat from './_titre-eager-format'

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

const titre = async ({ id }, context, info) => {
  try {
    const fields = fieldsBuild(info)

    const eager = eagerBuild(fields, 'titre', titreEagerFormat)

    const titreRes = await titreGet(id, { eager })

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
    const fields = fieldsBuild(info)
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
        eager: eagerBuild(fields, 'titres', titreEagerFormat)
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
    const user = context.user && (await utilisateurGet(context.user.id))

    if (
      !permissionsCheck(context.user, ['super']) &&
      !titrePermissionAdministrationsCheck(titre, user)
    ) {
      throw new Error('opération impossible')
    }

    const rulesErrors = await titreUpdationValidate(titre)

    if (rulesErrors.length) {
      throw new Error(rulesErrors.join(', '))
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
    const user = context.user && (await utilisateurGet(context.user.id))

    if (
      !permissionsCheck(context.user, ['super']) &&
      !titrePermissionAdministrationsCheck(titre, user)
    ) {
      throw new Error('opération impossible')
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
  const user = context.user && (await utilisateurGet(context.user.id))

  if (
    !permissionsCheck(context.user, ['super']) &&
    !titrePermissionAdministrationsCheck(titre, user)
  ) {
    throw new Error('opération impossible')
  }

  return titreDelete(id)
}

export { titre, titres, titreCreer, titreModifier, titreSupprimer }
