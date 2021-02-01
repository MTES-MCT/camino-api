import { ITitreDemarche } from '../../types'

/**
 * Vérifie la validité du titre pendant la période
 * @param titreDemarches - démarche du titre
 * @param dateDebut - date de début
 * @param dateFin - date de fin
 */
const titreValideCheck = (
  titreDemarches: ITitreDemarche[],
  dateDebut: string,
  dateFin: string
) =>
  titreDemarches &&
  titreDemarches.some(
    ({ phase }) =>
      phase && dateDebut <= phase.dateFin && dateFin >= phase.dateDebut
  )

export { titreValideCheck }
