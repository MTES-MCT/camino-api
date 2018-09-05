const titreStatutIdFind = td => {
  let titreStatut

  if (
    // si
    // - la date du jour est inférieure à la date d’échéance
    // - aucune démarche est en instruction || déposée || initiée

  ) {
    // alors
    // - le statut du titre est valide
  } else if (
  // sinon si
  // - une démarche a le statut en instruction

  ) {
    // alors
    // - le statut du titre est modification en instance
  } else if (
  // sinon si
  // - la seule démarche est une démarche d’octroi avec le statut en instruction || déposée


  ) {
    // alors
    // - le statut du titre est demande initiale
  } else if (
// sinon si
  // - la seule démarche est une démarche d’octroi 
  // - le statut rejetée || classée sans suite || retirée

  ) {
    // alors
    // - le statut du titre est demande classée
  } else {
    //  sinon --> 3. base case
    //  - le statut du titre est indéterminé
    titreStatut = 'ind'
  }

  return titreStatut
}

module.exports = titreStatutIdFind