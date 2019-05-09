import permissionsCheck from './_permissions-check'

const auth = (user, titre, permissions, amodiatairePriority) => {
  if (!user) {
    return false
  }

  const isAmodiataire = titre.amodiataires.some(t => t.id === user.entrepriseId)
  const isTitulaire = titre.titulaires.some(t => t.id === user.entrepriseId)

  // soit l'utilisateur a les permissions
  // soit l'utilisateur est dans le groupe 'entreprise', dans ce cas:
  // - si il est amodiataire, il est autorisé
  // - si il est titulaire il est autorisé,
  //   - si la condition 'amodiatairePriority' est FALSE,
  //   - ou si la  si il n'y a aucun amodiataire
  return (
    permissionsCheck(user, permissions) ||
    (permissionsCheck(user, ['entreprise']) &&
      (isAmodiataire ||
        (isTitulaire && (!amodiatairePriority || !titre.amodiataires.length))))
  )
}

export default auth
