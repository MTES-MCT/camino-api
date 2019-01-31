const permissionsCheck = (user, permissions) =>
  user && user.permission && permissions.includes(user.permission.id)

export default permissionsCheck
