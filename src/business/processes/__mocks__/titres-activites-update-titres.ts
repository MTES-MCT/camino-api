import { ITitres } from '../../../types'

const titresSansActivite = ([
  {
    id: 'h-cxx-courdemanges-1988',
    activites: []
  }
] as unknown) as ITitres[]

const titresToutesActivites = [
  {
    id: 'h-cxx-courdemanges-1988',
    activites: [
      {
        annee: 2018,
        frequencePeriodeId: 1
      },
      {
        annee: 2018,
        frequencePeriodeId: 2
      },
      {
        annee: 2018,
        frequencePeriodeId: 3
      },
      {
        annee: 2018,
        frequencePeriodeId: 4
      }
    ]
  }
] as ITitres[]

const titreActiviteTypeGuyane = {
  id: 'grp',
  dateDebut: 2018,
  nom: "rapport d'activité",
  frequenceId: 'tri'
}

const titreActivitesTypes = [titreActiviteTypeGuyane]

export { titresSansActivite, titresToutesActivites, titreActivitesTypes }
