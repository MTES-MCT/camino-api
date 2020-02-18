import { ITitre, IActiviteType } from '../../../types'

const titresSansActivite = ([
  {
    id: 'h-cx-courdemanges-1988',
    activites: []
  }
] as unknown) as ITitre[]

const titresToutesActivites = [
  {
    id: 'h-cx-courdemanges-1988',
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
] as ITitre[]

const titreActiviteTypeGuyane = ({
  id: 'grp',
  dateDebut: 2018,
  nom: "rapport d'activité",
  frequenceId: 'tri'
} as unknown) as IActiviteType

const titreActivitesTypes = [titreActiviteTypeGuyane]

export { titresSansActivite, titresToutesActivites, titreActivitesTypes }
