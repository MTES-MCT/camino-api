const titreDemarcheDateFinAndDureeFind = require('./titre-demarche-date-fin-duree-find')

/**
 * Trouve la date de fin d'un titre
 * @param {Array} titreDemarches la liste des démarches d'un titres
 * @return {String} la date de fin du titre sous forme yyyy-mm-dd
 */

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
