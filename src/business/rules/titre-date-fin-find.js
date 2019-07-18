import * as dateFormat from 'dateformat'
import titreDemarcheDateFinAndDureeFind from './titre-demarche-date-fin-duree-find'

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
