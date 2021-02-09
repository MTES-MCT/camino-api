import { ITitreActivite } from '../../types'

/**
 * Trouve le statut d'une activité
 * @param titreActivite - activité
 * @returns statut d'activité
 */

const titreActiviteStatutIdFind = (titreActivite: ITitreActivite) => {
  // si l'activité a un statut différent de "déposé" ou "fermé"

  if (!['dep', 'fer'].includes(titreActivite.statutId)) {
    const dateDepot = new Date(titreActivite.date)
    const dateDelai = new Date(dateDepot)

    dateDelai.setMonth(dateDepot.getMonth() + titreActivite.type!.delaiMois)

    // si le délai de remplissage est dépassé
    // passe le statut de l'activité à "fermé"

    if (Date.now() > dateDelai.getTime()) {
      return 'fer'
    }

    return titreActivite.statutId
  }

  // sinon retourne le statut de l'activité
  return titreActivite.statutId
}

export { titreActiviteStatutIdFind }
