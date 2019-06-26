import { titreActiviteInsert as titreActiviteInsertQuery } from '../../database/queries/titres-activites'
import titreActiviteCreate from '../rules/titre-activite-create'

const titreActiviteTypeUpdate = (titre, activiteType, annees) => {
  const { frequence } = activiteType

  const periods = activiteType.frequence[frequence.periodesNom]
  const monthsCount = 12 / periods.length

  const { activites: titreActivites } = titre

  return annees.reduce(
    (acc, annee) =>
      periods.reduce((acc, e, periodIndex) => {
        // cherche si l'activité existe déjà dans le titre
        let titreActivite =
          titreActivites &&
          titreActivites.find(
            a =>
              a.activiteTypeId === activiteType.id &&
              a.annee === annee &&
              a.frequencePeriodeId === periodIndex + 1
          )

        // la ligne d'activité existe déjà pour le titre
        // il n'est pas nécessaire de la créer
        if (titreActivite) return acc

        titreActivite = titreActiviteCreate(
          titre,
          activiteType.id,
          annee,
          periodIndex,
          monthsCount
        )

        return titreActivite
          ? [
              ...acc,
              titreActiviteInsertQuery(titreActivite).then(
                u => `Création: activité ${titreActivite.id}`
              )
            ]
          : acc
      }, acc),
    []
  )
}

export { titreActiviteTypeUpdate }
