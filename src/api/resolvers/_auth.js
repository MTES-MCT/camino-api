import permissionsCheck from './_permissions-check'

const auth = (user, titre) => {
  if (!user) {
    return false
  }

  const userEntreprisePermissionsGet = (user, titreEntrepriseIds) => {
    const entrepriseId = user.entreprise && user.entreprise.id
    return titreEntrepriseIds.some(id => id === entrepriseId)
  }

  const userHasAccessTest = async (user, titreEntrepriseIds) =>
    permissionsCheck(user, ['admin', 'super', 'editeur']) ||
    userEntreprisePermissionsGet(user, titreEntrepriseIds)

  return userHasAccessTest(user, [
    ...titre.titulaires.map(t => t.id),
    ...titre.amodiataires.map(t => t.id)
  ])
}

export default auth
