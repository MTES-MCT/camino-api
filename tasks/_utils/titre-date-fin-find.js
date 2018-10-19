const titreDemarcheDateFinAndDureeFind = require('./titre-demarche-date-fin-duree-find')

// entrée:
// - les démarches d'un titres
// sortie:
// - la date d'échéance du titre
const titreDateFinFind = titreDemarches => {
  // la dernière démarche dont le statut est acceptée ou terminée
  const titreDemarche = titreDemarches.find(titreDemarche =>
    ['acc', 'ter'].includes(titreDemarche.statutId)
  )

  const dateFin =
    titreDemarche &&
    titreDemarcheDateFinAndDureeFind(titreDemarches, titreDemarche.ordre)
      .dateFin

  return dateFin
}

module.exports = titreDateFinFind
