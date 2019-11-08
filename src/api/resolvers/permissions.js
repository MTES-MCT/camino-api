import { debug } from '../../config/index'

import {
  permissionGet,
  permissionsGet
} from '../../database/queries/permissions'

import { permissionsCheck } from './_permissions-check'

const permission = async ({ id }, context) => permissionGet(id)

const permissions = async (_, context) => {
  try {
    if (permissionsCheck(context.user, ['super', 'admin'])) {
      return permissionsGet({
        ordreMax: context.user ? context.user.permissionOrdre : null
      })
    }

    return null
  } catch (e) {
    if (debug) {
      console.error(e)
    }

    throw e
  }
}

export { permission, permissions }
