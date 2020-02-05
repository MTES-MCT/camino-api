// retourne le nombre d'activités par statut

const titrePropActivitesCount = (titreActivites, statutId) =>
  titreActivites.filter(a => a.statutId === statutId).length || null

export default titrePropActivitesCount
