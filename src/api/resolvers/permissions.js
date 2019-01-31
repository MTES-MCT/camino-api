import {
  permissionGet,
  permissionsGet
} from '../../database/queries/permissions'

import permissionsCheck from './_permissions-check'

const permission = async ({ id }, context) => permissionGet(id)

const permissions = async (_, context) => {
  if (permissionsCheck(context.user, ['super', 'admin'])) {
    return permissionsGet({
      ordreMax: context.user ? context.user.permission.ordre : null
    })
  }

  return null
}

export { permission, permissions }
