import { titreFormat } from '../../database/format'
import titreActivitesTypesFilter from '../rules/titre-activites-filter'
import { titreActiviteTypeUpdate } from '../queries/titre-activites'

const titresActivitesTypesUpdate = async (titres, activitesTypes, annees) => {
  // TODO: à supprimer une fois que
  // la requête ne renverra plus de doublons
  const processedTitres = {}

  const titresActivitesInsertRequests = titres
    // formate les pays des titres
    .map(titreFormat)
    .reduce((acc, titre) => {
      // TODO: à supprimer une fois que
      // la requête ne renverra plus de doublons
      if (processedTitres[titre.id]) return acc
      processedTitres[titre.id] = true

      // filtre les types d'activités qui concernent le titre
      const titreActivitesTypes = titreActivitesTypesFilter(
        titre,
        activitesTypes
      )

      if (!titreActivitesTypes.length) return acc

      return [
        ...acc,
        ...titreActivitesTypes.reduce(
          (acc, titreActiviteType) => [
            ...acc,
            ...titreActiviteTypeUpdate(titre, titreActiviteType, annees)
          ],
          []
        )
      ]
    }, [])
    .map(q => q.then(log => console.log(log)))

  await Promise.all(titresActivitesInsertRequests)

  return `Mise à jour: ${titresActivitesInsertRequests.length} activités.`
}

export default titresActivitesTypesUpdate
