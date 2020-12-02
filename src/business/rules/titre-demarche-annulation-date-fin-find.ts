import { ITitreEtape } from '../../types'

import titreEtapesSortAsc from '../utils/titre-etapes-sort-asc'
import titreEtapesSortDesc from '../utils/titre-etapes-sort-desc'

/**
 * Retourne la date de fin d'une démarche d'annulation
 *
 * @param titreEtapes - les étapes de la démarche d'annulation
 * @returns la date de fin si elle existe
 */

const titreDemarcheAnnulationDateFinFind = (titreEtapes: ITitreEtape[]) => {
  // si l’étape valide l’annulation
  const etapeAnnulationValideCheck = (te: ITitreEtape) =>
    // si on a une décision expresse (dex) ou unilatérale (dux)
    ['dex', 'dux'].includes(te.typeId) ||
    // si l’ARM a une signature de l’avenant à l’autorisation de recherche minière fait
    (te.typeId === 'aco' && te.statutId === 'fai')

  // la dernière étape qui valide l’annulation et qui contient une date de fin
  const etapeAnnulationHasDateFin = titreEtapesSortDesc(titreEtapes).find(
    te => te.dateFin && etapeAnnulationValideCheck(te)
  )

  // si la démarche contient une date de fin
  if (etapeAnnulationHasDateFin) {
    return etapeAnnulationHasDateFin.dateFin
  }

  // sinon,
  // trouve la première étape qui valide l’annulation
  const etapeAnnulation = titreEtapesSortAsc(titreEtapes).find(
    etapeAnnulationValideCheck
  )

  // la date de fin est la date de l'étape
  return etapeAnnulation?.date ? etapeAnnulation.date : null
}

export { titreDemarcheAnnulationDateFinFind }
