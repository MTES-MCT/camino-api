import { debug } from '../../config/index'
import permissionsCheck from './_permissions-check'
import { titreRestrict, titresRestrict } from './_titre'

import fieldsBuild from './_fields-build'
import eagerBuild from './_eager-build'
import titreEagerFormat from './_titre-eager-format'

import {
  titreGet,
  titresGet,
  titreCreate,
  titreUpdate,
  titreDelete
} from '../../database/queries/titres'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import titreUpdateTask from '../../business/titre-update'

import titreUpdationValidate from '../../business/titre-updation-validate'

const titre = async ({ id }, context, info) => {
  const fields = fieldsBuild(info)
  const titre = await titreGet(id, {
    eager: eagerBuild(fields, {
      format: titreEagerFormat,
      root: 'titre'
    }),
    format: fields
  })

  if (!titre) return null

  const user = context.user && (await utilisateurGet(context.user.id))

  return titreRestrict(titre, user)
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
      eager: eagerBuild(fields, {
        format: titreEagerFormat,
        root: 'titres'
      }),
      format: fields
    }
  )

  const user = context.user && (await utilisateurGet(context.user.id))

  return titresRestrict(titres, user)
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

    return titreUpdateTask(titre.id)
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

  const rulesError = await titreUpdationValidate(titreOld)
  console.log(rulesError)

  if (rulesError) {
    throw new Error(rulesError)
  }

  try {
    await titreUpdate(titre.id, titre)

    return titreUpdateTask(titre.id)
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
