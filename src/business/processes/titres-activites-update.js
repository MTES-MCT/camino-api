import titreActivitesTypesFilter from '../utils/titre-activites-filter'
import { titreActivitesUpsert } from '../../database/queries/titres-activites'
import titreActivitesBuild from '../rules/titre-activites-build'

const titreActiviteTypeAnneesFind = titreActiviteType => {
  // calcule les années qui concernent le type d'activité
  const anneeDebut = new Date(titreActiviteType.dateDebut).getFullYear()
  const anneeFin = new Date().getFullYear()

  const annees = []

  for (let annee = anneeDebut; annee < anneeFin; annee += 1) {
    annees.push(annee)
  }

  return annees
}

const titresActivitesUpdate = async (titres, activitesTypes) => {
  const titresActivitesCreated = activitesTypes.reduce(
    (acc, titreActiviteType) => {
      const annees = titreActiviteTypeAnneesFind(titreActiviteType)
      if (!annees.length) return acc

      acc.push(
        ...titres.reduce((acc, titre) => {
          // filtre les types d'activités qui concernent le titre
          console.log(
            titreActiviteType.id,
            titre.id,
            titreActivitesTypesFilter(titre, titreActiviteType)
          )
          if (!titreActivitesTypesFilter(titre, titreActiviteType)) return acc

          acc.push(...titreActivitesBuild(titre, titreActiviteType, annees))

          return acc
        }, [])
      )

      return acc
    },
    []
  )

  if (titresActivitesCreated.length) {
    await titreActivitesUpsert(titresActivitesCreated)

    console.log(
      `création: activité ${titresActivitesCreated.map(ta => ta.id).join(', ')}`
    )
  }

  return titresActivitesCreated
}

export default titresActivitesUpdate
