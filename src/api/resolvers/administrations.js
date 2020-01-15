import { debug } from '../../config/index'
import {
  administrationGet,
  administrationsGet
} from '../../database/queries/administrations'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import graphFieldsBuild from './graph/fields-build'
import graphBuild from './graph/build'
import graphFormat from './graph/format'
import {
  administrationFormat,
  administrationsFormat
} from './format/administration'

const administration = async ({ id }, context, info) => {
  try {
    const administration = await administrationGet(id, {
      graph: graphBuild(graphFieldsBuild(info), 'administration', graphFormat)
    })

    const user = context.user && (await utilisateurGet(context.user.id))

    return administrationFormat(administration, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

const administrations = async ({ noms }, context, info) => {
  try {
    const administrations = await administrationsGet(
      { noms },
      {
        graph: graphBuild(graphFieldsBuild(info), 'administration', graphFormat)
      }
    )

    const user = context.user && (await utilisateurGet(context.user.id))

    return administrationsFormat(administrations, user)
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { administration, administrations }
