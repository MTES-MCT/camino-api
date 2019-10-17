import { debug } from '../../config/index'
import { permissionsCheck } from './_permissions-check'
import { titreFormat, titresFormat } from './_titre-format'

import fieldsBuild from './_fields-build'
import eagerBuild from './_eager-build'
import titreEagerFormat from './_titre-eager-format'

import {
  titreCreate,
  titreDelete,
  titreGet,
  titresGet,
  titreUpdate
} from '../../database/queries/titres'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import titreUpdateTask from '../../business/titre-update'

import titreUpdationValidate from '../../business/titre-updation-validate'

const titre = async ({ id }, context, info) => {
  const fields = fieldsBuild(info)
  const eager = eagerBuild(fields, 'titre', titreEagerFormat)

  const titreRes = await titreGet(id, { eager })

  if (!titreRes) return null

  const user = context.user && (await utilisateurGet(context.user.id))

  return titreFormat(titreRes, user, fields)
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
}

const titreCreer = async ({ titre }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const rulesError = await titreUpdationValidate(titre)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    await titreCreate(titre)

    const user = context.user && (await utilisateurGet(context.user.id))

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
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  const titreOld = await titreGet(titre.id)

  const rulesError = await titreUpdationValidate(titre, titreOld)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    await titreUpdate(titre.id, titre)

    const titreRes = titreUpdateTask(titre.id)

    const user = context.user && (await utilisateurGet(context.user.id))

    return titreFormat(titreRes, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const titreSupprimer = async ({ id }, context, info) => {
  if (!permissionsCheck(context.user, ['super', 'admin'])) {
    throw new Error('opération impossible')
  }

  return titreDelete(id)
}

export { titre, titres, titreCreer, titreModifier, titreSupprimer }
