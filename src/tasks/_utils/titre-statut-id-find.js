const dateFormat = require('dateformat')
const titreDateFinFind = require('./titre-date-fin-find')

const titreStatutIdFind = titre => {
  const today = dateFormat(new Date(), 'yyyy-mm-dd')

  // si il y a une seule démarche (octroi)
  if (
    titre.demarches.length === 1 &&
    titre.demarches[0].typeId === 'oct' &&
    ['ins', 'dep', 'rej', 'cls', 'ret'].includes(titre.demarches[0].statutId)
  ) {
    // le statut de la démarche est en instruction ou déposée
    if (['ins', 'dep'].includes(titre.demarches[0].statutId)) {
      // le statut du titre est demande initiale
      return 'dmi'
    }

    // le statut de la démarche est rejetée ou classée sans suite ou retirée
    if (['rej', 'cls', 'ret'].includes(titre.demarches[0].statutId)) {
      // le statut du titre est demande classée
      return 'dmc'
    }

    return 'ind'
  }

  // une démarche a le statut en instruction
  if (titre.demarches.find(d => d.statutId === 'ins')) {
    // le statut du titre est modification en instance
    return 'mod'
  }

  // la date du jour est inférieure à la date d’échéance
  if (today < titreDateFinFind(titre.demarches)) {
    // le statut du titre est valide
    return 'val'
  }

  // le statut du titre est échu
  return 'ech'
}

module.exports = titreStatutIdFind
