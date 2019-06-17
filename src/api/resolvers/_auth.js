import permissionsCheck from './_permissions-check'

const auth = (user, titre, permissions, amodiatairePriority) => {
  if (!user) {
    return false
  }

  // les ARM sont cachées à tous les utilisateurs sauf 'onf' et 'super'
  if (titre.typeId === 'arm') {
    return permissionsCheck(user, ['super', 'onf'])
  }

  // soit l'utilisateur a les permissions
  if (permissionsCheck(user, permissions)) {
    return true
  }

  // soit l'utilisateur n'est pas dans le groupe 'entreprise'
  if (!permissionsCheck(user, ['entreprise'])) {
    return false
  }

  // sinon, s'il est dans le groupe 'entreprise' :

  // - si il est amodiataire, il est autorisé
  const isAmodiataire = titre.amodiataires.some(t =>
    user.entreprises.find(({ id }) => id === t.id)
  )

  if (isAmodiataire) {
    return true
  }

  // - si il est titulaire il est autorisé,
  //   - si la condition 'amodiatairePriority' est FALSE,
  //   - ou si il n'y a aucun amodiataire
  const isTitulaire = titre.titulaires.some(t =>
    user.entreprises.find(({ id }) => id === t.id)
  )

  return isTitulaire && (!amodiatairePriority || !titre.amodiataires.length)
}

export default auth
