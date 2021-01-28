import { ITitreDemarche } from '../../types'

import titreDateFinFind from './titre-date-fin-find'

const titreStatutIdFind = (
  aujourdhui: string,
  titreDemarches?: ITitreDemarche[] | null
) => {
  if (!titreDemarches || !titreDemarches.length) return 'ind'

  // si toutes les démarches du titre ont le statut `indéfini`
  // alors le titre a également le statut `indéfini`
  if (titreDemarches.every(d => d.statutId === 'ind')) return 'ind'

  // s'il y a une seule démarche (octroi)
  if (
    titreDemarches.length === 1 &&
    ['oct', 'vut', 'vct'].includes(titreDemarches[0].typeId) &&
    ['eco', 'ins', 'dep', 'rej', 'cls', 'des'].includes(
      titreDemarches[0].statutId!
    )
  ) {
    // le statut de la démarche est en instruction ou déposée
    if (['eco', 'ins', 'dep'].includes(titreDemarches[0].statutId!)) {
      // le statut du titre est demande initiale
      return 'dmi'
    }

    // le statut de la démarche est rejeté ou classé sans suite ou désisté
    // le statut du titre est demande classée
    return 'dmc'
  }

  // une démarche a le statut en instruction
  if (titreDemarches.find(d => d.statutId === 'ins')) {
    // le statut du titre est modification en instance
    return 'mod'
  }

  // la date du jour est inférieure à la date d’échéance
  const dateFin = titreDateFinFind(titreDemarches)

  if (dateFin && aujourdhui < dateFin) {
    // le statut du titre est valide
    return 'val'
  }

  // le statut du titre est échu
  return 'ech'
}

export { titreStatutIdFind }
