import { ITitre } from '../../types'

import * as dateFormat from 'dateformat'
import titreDateFinFind from './titre-date-fin-find'

const titreStatutIdFind = (titre: ITitre) => {
  if (!titre.demarches || !titre.demarches.length) return 'ind'

  // si toutes les démarches du titre ont le statut `indéfini`
  // alors le titre a également le statut `indéfini`
  if (titre.demarches.every(d => d.statutId === 'ind')) return 'ind'

  // s'il y a une seule démarche (octroi)
  if (
    titre.demarches.length === 1 &&
    ['oct', 'vut', 'vct'].includes(titre.demarches[0].typeId) &&
    ['eco', 'ins', 'dep', 'rej', 'cls', 'ret'].includes(
      titre.demarches[0].statutId!
    )
  ) {
    // le statut de la démarche est en instruction ou déposée
    if (['eco', 'ins', 'dep'].includes(titre.demarches[0].statutId!)) {
      // le statut du titre est demande initiale
      return 'dmi'
    }

    // le statut de la démarche est rejetée ou classée sans suite ou retirée
    // le statut du titre est demande classée
    return 'dmc'
  }

  // une démarche a le statut en instruction
  if (titre.demarches.find(d => d.statutId === 'ins')) {
    // le statut du titre est modification en instance
    return 'mod'
  }

  // la date du jour est inférieure à la date d’échéance
  const dateFin = titreDateFinFind(titre.demarches)
  const today = dateFormat(new Date(), 'yyyy-mm-dd')
  if (dateFin && today < dateFin) {
    // le statut du titre est valide
    return 'val'
  }

  // le statut du titre est échu
  return 'ech'
}

export default titreStatutIdFind
