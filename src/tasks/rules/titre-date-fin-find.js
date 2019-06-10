import * as dateFormat from 'dateformat'
import titreDemarcheDateFinAndDureeFind from './titre-demarche-date-fin-duree-find'

/**
 * Trouve la date de fin d'un titre
 * @param {titreDemarche[]} titreDemarches la liste des démarches d'un titres
 * @return {String} la date de fin du titre sous forme yyyy-mm-dd
 */

const titreDateFinFind = titreDemarches => {
  // la dernière démarche dont le statut est acceptée ou terminée
  const titreDemarche = titreDemarches.find(titreDemarche =>
    ['acc', 'ter'].includes(titreDemarche.statutId)
  )

  if (!titreDemarche) return null

  return dateFormat(
    titreDemarcheDateFinAndDureeFind(titreDemarches, titreDemarche.ordre)
      .dateFin,
    'yyyy-mm-dd'
  )
}

export default titreDateFinFind
