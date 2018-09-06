const dateFormat = require('./date-format')
const titreEcheanceFind = require('./titre-echeance-find')

const titreStatutIdFind = titre => {
  let titreStatutId

  const titreEcheance = titreEcheanceFind(titre.demarches)
  const today = dateFormat(new Date())

  if (
    // il y a une seule démarche (octroi)
    titre.demarches.length === 1 &&
    titre.demarches[0].demarcheId === 'oct' &&
    ['ins', 'dep', 'rej', 'cls', 'ret'].includes(
      titre.demarches[0].demarcheStatutId
    )
  ) {
    if (
      // le statut de la démarche est en instruction || déposée
      ['ins', 'dep'].includes(titre.demarches[0].demarcheStatutId)
    ) {
      // le statut du titre est demande initiale
      titreStatutId = 'dmi'
    } else if (
      // le statut de la démarche est rejetée || classée sans suite || retirée
      ['rej', 'cls', 'ret'].includes(titre.demarches[0].demarcheStatutId)
    ) {
      // le statut du titre est demande classée
      titreStatutId = 'dmc'
    }
  } else if (
    // une démarche a le statut en instruction
    titre.demarches.find(d => d.demarcheStatutId === 'ins')
  ) {
    // le statut du titre est modification en instance
    titreStatutId = 'mod'
  } else if (
    // la date du jour est inférieure à la date d’échéance
    today < titreEcheance
  ) {
    // le statut du titre est valide
    titreStatutId = 'val'
  } else {
    // le statut du titre est échu
    titreStatutId = 'ech'
  }

  return titreStatutId || 'ind'
}

module.exports = titreStatutIdFind
