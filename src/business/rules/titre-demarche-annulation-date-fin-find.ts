import { ITitreEtape } from '../../types'

import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'
import titreEtapesDescSort from '../utils/titre-etapes-desc-sort'

/**
 * Retourne la date de fin d'une démarche d'annulation
 *
 * @param titreEtapes - les étapes de la démarche d'annulation
 * @returns la date de fin si elle existe
 */

const titreDemarcheAnnulationDateFinFind = (titreEtapes: ITitreEtape[]) => {
  // la dernière étape dex ou dux qui contient une date de fin
  const etapeDexHasDateFin = titreEtapesDescSort(titreEtapes).find(
    te => ['dex', 'dux'].includes(te.typeId) && te.dateFin
  )

  // si la démarche contient une date de fin
  if (etapeDexHasDateFin) {
    return etapeDexHasDateFin.dateFin
  }

  // sinon,
  // trouve la première étape de décision expresse (dex) ou unilatérale (dux)
  const etapeDex = titreEtapesAscSort(titreEtapes).find(te =>
    ['dex', 'dux'].includes(te.typeId)
  )

  // la date de fin est la date de l'étape
  return etapeDex?.date ? etapeDex.date : null
}

export { titreDemarcheAnnulationDateFinFind }
