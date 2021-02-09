import { ITitreDemarche } from '../../types'
import { titreStatutIdFind } from '../rules/titre-statut-id-find'
import { titreDemarchesEtapesRebuild } from './titre-demarches-etapes-rebuild'

/**
 * Vérifie la validité du titre pendant la période
 * @param titreDemarches - démarche du titre
 * @param dateDebut - date de début
 * @param dateFin - date de fin
 * @param titreTypeId - id du type de titre
 */
const titreValideCheck = (
  titreDemarches: ITitreDemarche[],
  dateDebut: string,
  dateFin: string,
  titreTypeId: string
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
  const titreDemarchesFiltered = titreDemarchesEtapesRebuild(
    dateDebut,
    titreDemarches,
    titreTypeId
  )

  const titreStatutId = titreStatutIdFind(dateDebut, titreDemarchesFiltered)

  if (titreStatutId === 'mod') return true

  return false
}

export { titreValideCheck }
