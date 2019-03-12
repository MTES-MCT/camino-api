import { titreActiviteInsert as titreActiviteInsertQuery } from '../../database/queries/titres-activites'
import titreValiditePeriodeCheck from '../utils/titre-validite-periode-check'

const titreActiviteTypeUpdate = (titre, activiteType, annees) => {
  const { id: activiteTypeId, frequence } = activiteType

  const periods = frequence[frequence.elementsNom]

  const periodMonthsCount = 12 / periods.length

  return annees.reduce(
    (acc, annee) =>
      periods.reduce((acc, e, i) => {
        const periodeStart = new Date(annee, i * periodMonthsCount, 1)
        const periodeEnd = new Date(annee, (i + 1) * periodMonthsCount, 1)

        // vérifie la validité du titre pour la période
        const valid = titreValiditePeriodeCheck(titre, periodeStart, periodeEnd)
        if (!valid) return acc

        const activite =
          titre.activites &&
          titre.activites.find(
            a => a.annee === annee && a.frequenceElementId === i + 1
          )

        // la ligne d'activité existe déjà pour le titre
        // il n'est pas nécessaire de la créer
        if (activite) return acc

        const titreActivite = {
          titreId: titre.id,
          // la date de début de l'activité est le premier jour du mois
          // du début de la période suivante, en fonction de la fréquence
          date: new Date(annee, (i + 1) * periodMonthsCount, 1),
          activiteTypeId,
          // le statut de l'activité crée automatiquement
          // est 'absente'
          activiteStatutId: 'abs',
          frequenceElementId: i + 1,
          annee
        }

        return [
          ...acc,
          titreActiviteInsertQuery(titreActivite).then(
            u => `Création: activité ${titreActivite.id}`
          )
        ]
      }, acc),
    []
  )
}

export { titreActiviteTypeUpdate }
