import { ITitreActivite } from '../../types'

/**
 * Trouve le statut d'une activité
 * @param titreActivite - activité
 * @param aujourdhui - date au format yyyy-mm-dd
 * @returns statut d'activité
 */

const titreActiviteStatutIdFind = (
  titreActivite: ITitreActivite,
  aujourdhui: string
) => {
  // si l'activité a un statut différent de "déposé" ou "fermé"

  if (!['dep', 'fer'].includes(titreActivite.statutId)) {
    const date = new Date(aujourdhui)
    const dateDepot = new Date(titreActivite.date)
    const dateDelai = new Date(dateDepot)

    dateDelai.setMonth(dateDepot.getMonth() + titreActivite.type!.delaiMois)

    // si le délai de remplissage est dépassé
    // passe le statut de l'activité à "fermé"

    if (date.getTime() > dateDelai.getTime()) {
      return 'fer'
    }

    return titreActivite.statutId
  }

  // sinon retourne le statut de l'activité
  return titreActivite.statutId
}

export { titreActiviteStatutIdFind }
