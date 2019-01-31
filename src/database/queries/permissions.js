import Permissions from '../models/permissions'

const permissionsGet = async ({ ordreMax }) =>
  Permissions.query()
    .skipUndefined()
    .where('ordre', '>=', ordreMax)
    .orderBy('ordre')

const permissionGet = async id => Permissions.query().findById(id)

export { permissionsGet, permissionGet }
