const permissionsCheck = (user, permissions) =>
  user && user.permissionId && permissions.includes(user.permissionId)

const permissionsAdministrationsCheck = (user, administrationsIds) =>
  user &&
  user.administrations &&
  user.administrations.length &&
  administrationsIds.length &&
  user.administrations.some(ua => administrationsIds.includes(ua.id))

export { permissionsCheck, permissionsAdministrationsCheck }
