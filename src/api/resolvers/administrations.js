import { debug } from '../../config/index'
import {
  administrationGet,
  administrationsGet
} from '../../database/queries/administrations'
import { utilisateurGet } from '../../database/queries/utilisateurs'

import fieldsBuild from './_fields-build'
import eagerBuild from './_eager-build'
import titreEagerFormat from './_titre-eager-format'
import {
  administrationFormat,
  administrationsFormat
} from './format/administration'

const administration = async ({ id }, context, info) => {
  try {
    const administration = await administrationGet(id, {
      eager: eagerBuild(fieldsBuild(info), 'administration', titreEagerFormat)
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
        eager: eagerBuild(fieldsBuild(info), 'administration', titreEagerFormat)
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
