const permissionsCheck = (user, permissions) =>
  user && user.permission && permissions.includes(user.permission.id)

module.exports = permissionsCheck
