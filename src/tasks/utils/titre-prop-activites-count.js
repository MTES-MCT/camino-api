// retourne le nombre d'activités par statut

const titrePropActivitesCount = (titreActivites, activiteStatutId) =>
  titreActivites.filter(a => a.activiteStatutId === activiteStatutId).length ||
  null

export default titrePropActivitesCount
