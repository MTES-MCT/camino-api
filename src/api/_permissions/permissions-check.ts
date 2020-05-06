import { IUtilisateur } from '../../types'

const permissionsCheck = (
  user: IUtilisateur | undefined,
  permissions: string[]
) => !!(user && user.permissionId && permissions.includes(user.permissionId))

export { permissionsCheck }
