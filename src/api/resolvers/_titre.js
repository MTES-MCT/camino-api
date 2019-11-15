import titreAdministrationsCentralesBuild from '../../business/rules/titre-administrations-centrales-build'

import {
  permissionsCheck,
  permissionsAdministrationsCheck
} from './_permissions-check'
import restrictions from './_restrictions'

const titreIsPublicCheck = titre =>
  !restrictions.domaines.find(
    d => d.domaineId === titre.domaineId && d.publicLectureInterdit
  ) &&
  !restrictions.typesStatuts.find(
    t =>
      t.typeId === titre.typeId &&
      t.statutId === titre.statutId &&
      t.publicLectureInterdit
  )

const titrePermissionCheck = (
  titre,
  user,
  permissions,
  amodiatairePriority
) => {
  if (!user) {
    return false
  }

  // si l'utilisateur est un super admin
  // alors le titre est accessible
  if (permissionsCheck(user, ['super'])) {
    return true
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
    titre.amodiataires &&
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
    titre.titulaires &&
    titre.titulaires.some(t =>
      user.entreprises.find(({ id }) => id === t.id)
    ) &&
    (!amodiatairePriority || !titre.amodiataires.length)
  )
}

const titrePermissionAdministrationsCheck = (titre, user) =>
  ((titre.administrationsCentrales && titre.administrationsCentrales.length) ||
    (titre.administrationsLocales && titre.administrationsLocales.length)) &&
  permissionsAdministrationsCheck(user, [
    ...titre.administrationsLocales.map(a => a.id),
    ...titre.administrationsCentrales.map(a => a.id)
  ])

const titrePermissionAdministrationsEditionCheck = (
  titre,
  administrations,
  user,
  editionMode
) => {
  // dans un premier temps, on ne vérifie la création que pour les ARM
  if (titre.typeId !== 'arm') return false

  // calcule les administrations centrales pour le titre
  const titreAdministrationsCentrales = titreAdministrationsCentralesBuild(
    titre,
    administrations
  )

  if (!titreAdministrationsCentrales.length) return false

  console.log(titre)

  // filtre les restrictions pour ne garder que celles qui concernent le titre
  const titreRestrictions = restrictions.typesStatutsAdministrations.filter(
    restriction =>
      restriction.typeId === titre.typeId &&
      // si le titre n'a pas de statut, c'est qu'il est en train d'être créé
      restriction.statutId === (titre.statutId || 'dmi') &&
      restriction[`${editionMode}Interdit`]
  )

  console.log({ titreRestrictions })

  // filtre les administration qui font l'objet d'une restriction
  const titreAdministrationsCentralesEdition = titreAdministrationsCentrales.filter(
    ac =>
      !titreRestrictions.find(r => r.administrationId === ac.administrationId)
  )

  console.log({
    userAdmin: user.administrations,
    titreAdministrationsCentrales,
    titreAdministrationsCentralesEdition
  })

  // return false

  // - si l'utilisateur a les droits de création sur le domaine/type de titre
  return permissionsAdministrationsCheck(
    user,
    titreAdministrationsCentralesEdition.map(a => a.administrationId)
  )
}

export {
  titreIsPublicCheck,
  titrePermissionCheck,
  titrePermissionAdministrationsCheck,
  titrePermissionAdministrationsEditionCheck
}
