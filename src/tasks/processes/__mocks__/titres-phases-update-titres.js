const titresSansPhase = [
  {
    id: 'h-cxx-courdemanges-1988',
    demarches: [
      {
        id: 'h-cxx-courdemanges-1988-oct01',
        titreId: 'h-cxx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        etapes: []
      }
    ]
  }
]

const titresUnePhase = [
  {
    id: 'h-cxx-courdemanges-1988',
    demarches: [
      {
        id: 'h-cxx-courdemanges-1988-oct01',
        titreId: 'h-cxx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '2200-01-01',
            dateFin: '2500-01-01'
          },
          {
            id: 'h-cxx-courdemanges-1988-oct01-dex01',
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '2200-01-01',
            dateFin: '2500-01-01'
          }
        ]
      }
    ]
  }
]

const titresDeuxPhases = [
  {
    id: 'h-cxx-courdemanges-1988',
    demarches: [
      {
        id: 'h-cxx-courdemanges-1988-oct01',
        titreId: 'h-cxx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '2200-01-01',
            dateFin: '2500-01-01'
          },
          {
            id: 'h-cxx-courdemanges-1988-oct01-dex01',
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '2200-01-01',
            dateFin: '2500-01-01'
          }
        ]
      },
      {
        id: 'h-cxx-courdemanges-1988-pro01',
        titreId: 'h-cxx-courdemanges-1988',
        typeId: 'pro',
        statutId: 'acc',
        ordre: 2,
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-pro01-dpu01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '2019-01-02',
            dateFin: '3000-01-01'
          },
          {
            id: 'h-cxx-courdemanges-1988-pro01-dex01',
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '2019-01-02',
            dateFin: '3000-01-01'
          }
        ]
      }
    ]
  }
]

const titresPhaseASupprimer = [
  {
    id: 'h-cxx-courdemanges-1988',
    demarches: [
      {
        id: 'h-cxx-courdemanges-1988-oct01',
        titreId: 'h-cxx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        phase: {
          titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
          dateFin: '2500-01-01',
          dateDebut: '2200-01-01',
          statutId: 'val'
        },
        etapes: []
      }
    ]
  }
]

const titresUnePhaseSansChangement = [
  {
    id: 'h-cxx-courdemanges-1988',
    demarches: [
      {
        id: 'h-cxx-courdemanges-1988-oct01',
        titreId: 'h-cxx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        phase: {
          titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
          dateFin: '2500-01-01',
          dateDebut: '2200-01-01',
          statutId: 'val'
        },
        etapes: [
          {
            id: 'h-cxx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '2200-01-01',
            dateFin: '2500-01-01'
          },
          {
            id: 'h-cxx-courdemanges-1988-oct01-dex01',
            typeId: 'dex',
            statutId: 'acc',
            ordre: 1,
            date: '2200-01-01',
            dateFin: '2500-01-01'
          }
        ]
      }
    ]
  }
]

export {
  titresSansPhase,
  titresUnePhase,
  titresDeuxPhases,
  titresPhaseASupprimer,
  titresUnePhaseSansChangement
}
