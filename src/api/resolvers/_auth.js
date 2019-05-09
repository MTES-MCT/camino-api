import permissionsCheck from './_permissions-check'

const auth = (user, titre, permissions, amodiatairePriority) => {
  if (!user) {
    return false
  }

  const isAmodiataire = titre.amodiataires.some(t => t.id === user.entrepriseId)
  const isTitulaire = titre.titulaires.some(t => t.id === user.entrepriseId)

  // soit l'utilisateur a les permissions
  // soit l'utilisateur est de type 'entreprise', dans ce cas:
  // - si la condition 'amodiatairePriority' est FALSE,
  //   l'utilisateur est autorisé, qu'il soit titulaire ou amodiataire
  // - sinon ('amodiatairePriority' est TRUE)
  //   l'utilisateur n'est autorisé que
  //   - si il est amodiataire
  //   - ou si il est titulaire, mais si il n'y a aucun amodiataire
  return (
    permissionsCheck(user, permissions) ||
    (permissionsCheck(user, ['entreprise']) && !amodiatairePriority
      ? isAmodiataire || isTitulaire
      : isAmodiataire || (!titre.amodiataires.length && isTitulaire))
  )
}

export default auth
