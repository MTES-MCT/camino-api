import { ITitreDemarche } from '../../types'

import { titreStatutIdFind } from '../rules/titre-statut-id-find'
import { titreDemarchesEtapesRebuild } from './titre-demarches-etapes-rebuild'

/**
 * Vérifie la validité du titre pendant la période
 * @param titreDemarches - démarches du titre
 * @param dateDebut - date de début
 * @param dateFin - date de fin
 * @param titreTypeId - id du type de titre
 * @param hasDemarcheDeposee - si un titre échu avec une démarche déposée doit être pris en compte
 */
const titreValideCheck = (
  titreDemarches: ITitreDemarche[],
  dateDebut: string,
  dateFin: string,
  titreTypeId: string,
  hasDemarcheDeposee = false
) => {
  // si le titre a une phase entre dateDebut et dateFin
  if (
    titreDemarches.some(
      ({ phase }) =>
        phase && dateDebut <= phase.dateFin && dateFin >= phase.dateDebut
    )
  )
    return true

  const newTitreDemarches = titreDemarchesEtapesRebuild(
    dateDebut,
    titreDemarches,
    titreTypeId
  )

  // si le titre a le statut "modification en instance" au moment de dateDebut
  const titreStatutId = titreStatutIdFind(dateDebut, newTitreDemarches)

  if (titreStatutId === 'mod') return true

  // si
  // - on souhaite savoir si le titre a une démarche déposée
  // - le titre a le statut échu
  // - le titre a plusieurs démarches
  // - la dernière démarche a le statut déposée
  if (
    hasDemarcheDeposee &&
    titreStatutId === 'ech' &&
    newTitreDemarches.length > 1 &&
    newTitreDemarches[0].statutId === 'dep'
  ) {
    return true
  }

  return false
}

export { titreValideCheck }
