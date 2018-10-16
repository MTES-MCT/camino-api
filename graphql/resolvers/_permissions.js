const permissionsCheck = (user, permissions) =>
  user && permissions.includes(user.permission.id)

module.exports = { permissionsCheck }
