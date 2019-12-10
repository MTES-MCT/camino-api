import { debug } from '../../config/index'
import {
  administrationGet,
  administrationsGet
} from '../../database/queries/administrations'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'
import graphBuild from './_graph-build'
import titreGraphFormat from './_titre-graph-format'
import {
  administrationFormat,
  administrationsFormat
} from './format/administration'

const administration = async ({ id }, context, info) => {
  try {
    const administration = await administrationGet(id, {
      graph: graphBuild(fieldsBuild(info), 'administration', titreGraphFormat)
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
        graph: graphBuild(fieldsBuild(info), 'administration', titreGraphFormat)
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
