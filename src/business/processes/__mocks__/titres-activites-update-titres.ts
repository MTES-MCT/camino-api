import ActivitesTypes from '../../../database/models/activites-types'
import Titres from '../../../database/models/titres'

const titresSansActivite = ([
  {
    id: 'h-cx-courdemanges-1988',
    activites: []
  }
] as unknown) as Titres[]

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
] as Titres[]

const titreActiviteTypeGuyane = ({
  id: 'grp',
  dateDebut: 2018,
  nom: "rapport d'activité",
  frequenceId: 'tri'
} as unknown) as ActivitesTypes

const titreActivitesTypes = [titreActiviteTypeGuyane]

export { titresSansActivite, titresToutesActivites, titreActivitesTypes }
