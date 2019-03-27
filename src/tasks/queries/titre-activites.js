import { titreActiviteInsert as titreActiviteInsertQuery } from '../../database/queries/titres-activites'
import titreActiviteCreate from '../rules/titre-activite-create'

const titreActiviteTypeUpdate = (titre, activiteType, annees) => {
  const { frequence } = activiteType

  const periods = activiteType.frequence[frequence.periodesNom]
  const monthsCount = 12 / periods.length

  return annees.reduce(
    (acc, annee) =>
      periods.reduce((acc, e, periodIndex) => {
        const titreActivite = titreActiviteCreate(
          titre,
          activiteType.id,
          annee,
          periodIndex,
          monthsCount
        )

        if (!titreActivite) return acc

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
