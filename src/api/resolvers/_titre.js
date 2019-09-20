import permissionsCheck from './_permissions-check'
import {
  restrictedDomaineIds,
  restrictedTypeIds,
  restrictedStatutIds
} from './_restrictions'

const titreIsPublicCheck = ({ domaineId, typeId, statutId }) =>
  !restrictedDomaineIds.includes(domaineId) &&
  !restrictedTypeIds.includes(typeId) &&
  !restrictedStatutIds.includes(statutId)

const titrePermissionCheck = (
  titre,
  user,
  permissions,
  amodiatairePriority
) => {
  if (!user) {
    return false
  }

  // si
  // - le titre est de type ARM
  // alors, si l'utilisateurs appartient au groupe 'onf' ou 'super'
  // le titre est accessible
  // sinon le titre est inaccessible
  if (titre.typeId === 'arm') {
    return permissionsCheck(user, ['super', 'onf'])
  }

  // si l'utilisateur a les permissions
  // le titre est accessible
  if (permissionsCheck(user, permissions)) {
    return true
  }

  // si l'utilisateur n'est pas dans le groupe 'entreprise'
  // le titre est inaccessible
  if (!permissionsCheck(user, ['entreprise'])) {
    return false
  }

  // sinon,
  // (l'utilisateur est dans le groupe 'entreprise')

  // si l'utilisateur est amodiataire,
  // le titre est accessible
  if (
    titre.amodiataires.some(t => user.entreprises.find(({ id }) => id === t.id))
  ) {
    return true
  }

  // si
  // - l'utilisateur est titulaire
  // - et si
  //   - la condition 'amodiatairePriority' est FALSE
  //   - ou il n'y a aucun amodiataire
  // le titre est accessible
  // sinon le titre est inaccessible
  return (
    titre.titulaires.some(t =>
      user.entreprises.find(({ id }) => id === t.id)
    ) &&
    (!amodiatairePriority || !titre.amodiataires.length)
  )
}

const titrePublicRestrict = titre => {
  titre.activites = []
  titre.activitesAbsentes = null
  titre.activitesDeposees = null
  titre.activitesEnConstruction = null
  if (titre.demarches) {
    titre.demarches.forEach(td => {
      if (td.etapes) {
        td.etapes.forEach(te => {
          if (te.documents) {
            te.documents = te.documents.filter(ed => ed.public)
          }

          if (te.visas) {
            delete te.visas
          }
        })
      }
    })
  }

  return titre
}

const titreRestrict = (titre, user) => {
  // si
  // - l'utilisateur est authentifié
  // - il a un droit d'accès supérieur
  // il peut voir le titre
  if (titrePermissionCheck(titre, user, ['admin', 'super', 'editeur'])) {
    return titre
  }

  // si le titre est public
  if (titreIsPublicCheck(titre)) {
    return titrePublicRestrict(titre)
  }

  return null
}

const titresRestrict = (titres, user) =>
  titres &&
  titres.reduce((acc, titre) => {
    const titreRestricted = titreRestrict(titre, user)

    if (titreRestricted) {
      acc.push(titreRestricted)
    }

    return acc
  }, [])

export {
  titreIsPublicCheck,
  titrePermissionCheck,
  titreRestrict,
  titresRestrict
}
