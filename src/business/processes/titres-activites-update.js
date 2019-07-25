import titreActivitesTypesFilter from '../utils/titre-activites-filter'
import { titreActivitesUpsert } from '../../database/queries/titres-activites'
import titreActivitesBuild from '../rules/titre-activites-build'

const titresActivitesUpdate = async (titres, activitesTypes, annees) => {
  // TODO:
  // - à supprimer une fois que la requête ne renverra plus de doublons
  // - doit on supprimer des activités (pe: si un titre change de périmètre)
  const processedTitres = {}

  const titresActivitesNew = titres
    // formate les pays des titres
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
            ...titreActivitesBuild(titre, titreActiviteType, annees)
          ],
          []
        )
      ]
    }, [])

  if (titresActivitesNew.length) {
    await titreActivitesUpsert(titresActivitesNew)
    console.log(
      `création: activité ${titresActivitesNew.map(ta => ta.id).join(', ')}`
    )
  }

  return `mise à jour: ${titresActivitesNew.length} activités`
}

export default titresActivitesUpdate
