const titresSansActivite = [
  {
    id: 'h-cxx-courdemanges-1988',
    activites: []
  },
  // TODO: à supprimer une fois que
  // la requête ne renverra plus de doublons
  {
    id: 'h-cxx-courdemanges-1988',
    activites: []
  }
]

const titresUneActivite = [
  {
    id: 'h-cxx-courdemanges-1988',
    activites: [
      {
        annee: 2018,
        frequenceElementId: 1
      }
    ]
  }
]

const titresToutesActivites = [
  {
    id: 'h-cxx-courdemanges-1988',
    activites: [
      {
        annee: 2018,
        frequenceElementId: 1
      },
      {
        annee: 2018,
        frequenceElementId: 2
      },
      {
        annee: 2018,
        frequenceElementId: 3
      },
      {
        annee: 2018,
        frequenceElementId: 4
      }
    ]
  }
]

const activite = {}

export { titresSansActivite, titresUneActivite, titresToutesActivites }
