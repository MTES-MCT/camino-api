import { ITitreActivite } from '../../types'
import dateFormat from 'dateformat'

const titreActiviteDateDelaiFind = (
  date: string,
  delaiMois: number
): string => {
  const dateCreation = new Date(date)
  const dateDelai = new Date(date)
  dateDelai.setMonth(dateCreation.getMonth() + delaiMois)

  return dateFormat(dateDelai, 'yyyy-mm-dd')
}
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
    const dateDelai = titreActiviteDateDelaiFind(
      titreActivite.date,
      titreActivite.type!.delaiMois
    )

    // si le délai de remplissage est dépassé
    // passe le statut de l'activité à "fermé"

    if (aujourdhui > dateDelai) {
      return 'fer'
    }

    return titreActivite.statutId
  }

  // sinon retourne le statut de l'activité
  return titreActivite.statutId
}

export { titreActiviteStatutIdFind, titreActiviteDateDelaiFind }
