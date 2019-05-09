import permissionsCheck from './_permissions-check'

const auth = (user, titre, permissions, amodiatairePriority) => {
  if (!user) {
    return false
  }

  const isAmodiataire = titre.amodiataires.some(t => t.id === user.entrepriseId)
  const isTitulaire = titre.titulaires.some(t => t.id === user.entrepriseId)

  return (
    permissionsCheck(user, permissions) ||
    (permissionsCheck(user, ['entreprise']) && amodiatairePriority
      ? isAmodiataire || (!titre.amodiataires.length && isTitulaire)
      : isAmodiataire || isTitulaire)
  )
}

export default auth
