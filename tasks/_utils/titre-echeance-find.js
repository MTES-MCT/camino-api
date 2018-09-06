const titreDemarcheEcheanceAndDureeFind = require('./titre-demarche-echeance-duree-find')

// entrée:
// - les démarches d'un titres
// sortie:
// - la date d'échéance du titre
const titreEcheanceFind = titreDemarches => {
  // la dernière démarche dont le statut est acceptée ou terminée
  const titreDemarche = titreDemarches
    .reverse()
    .find(titreDemarche =>
      ['acc', 'ter'].includes(titreDemarche.demarcheStatutId)
    )

  const echeance =
    titreDemarche &&
    titreDemarcheEcheanceAndDureeFind(titreDemarches, titreDemarche.ordre)
      .echeance

  return echeance
}

module.exports = titreEcheanceFind
