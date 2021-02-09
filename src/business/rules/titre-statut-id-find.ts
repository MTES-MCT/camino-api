import { ITitreDemarche } from '../../types'

import { titreDateFinFind } from './titre-date-fin-find'

const titreStatutIdFind = (
  aujourdhui: string,
  titreDemarches?: ITitreDemarche[] | null
) => {
  if (!titreDemarches || !titreDemarches.length) return 'ind'

  // si toutes les démarches du titre ont le statut `indéfini`
  // -> le titre a également le statut `indéfini`
  if (titreDemarches.every(d => d.statutId === 'ind')) return 'ind'

  // s'il y a une seule démarche (octroi)
  if (
    titreDemarches.length === 1 &&
    ['oct', 'vut', 'vct'].includes(titreDemarches[0].typeId) &&
    ['eco', 'ins', 'dep', 'rej', 'cls', 'des'].includes(
      titreDemarches[0].statutId!
    )
  ) {
    // si le statut de la démarche est en instruction ou déposée
    // -> le statut du titre est demande initiale
    if (['eco', 'ins', 'dep'].includes(titreDemarches[0].statutId!)) {
      return 'dmi'
    }

    // si le statut de la démarche est rejeté ou classé sans suite ou désisté
    // -> le statut du titre est demande classée
    return 'dmc'
  }

  // si une démarche a le statut en instruction
  // -> le statut du titre est modification en instance
  if (titreDemarches.find(d => d.statutId === 'ins')) {
    return 'mod'
  }

  // si la date du jour est inférieure à la date d’échéance
  // -> le statut du titre est valide
  const dateFin = titreDateFinFind(titreDemarches)

  if (dateFin && aujourdhui < dateFin) {
    return 'val'
  }

  // sinon le statut du titre est échu
  return 'ech'
}

export { titreStatutIdFind }
