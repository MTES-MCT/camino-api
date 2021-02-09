import { ITitreDemarche } from '../../types'
import { titreStatutIdFind } from '../rules/titre-statut-id-find'

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
) => {
  // si le titre a une phase entre dateDebut et dateFin
  if (
    titreDemarches.some(
      ({ phase }) =>
        phase && dateDebut <= phase.dateFin && dateFin >= phase.dateDebut
    )
  )
    return true

  // si le titre a le statut "modification en instance" au moment de dateDebut
  const titreDemarchesFiltered = titreDemarches.filter(td =>
    td.etapes?.some(te => te.date < dateDebut)
  )

  const titreStatutId = titreStatutIdFind(dateDebut, titreDemarchesFiltered)

  if (titreStatutId === 'mod') return true

  return false
}

export { titreValideCheck }
