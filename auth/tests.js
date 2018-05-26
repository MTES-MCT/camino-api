const hasPermission = (role, user) => {
  if (user && user.role === role) {
    return true
  } else {
    throw new Error('Permission required')
  }
}

module.exports = {
  hasPermission
}
