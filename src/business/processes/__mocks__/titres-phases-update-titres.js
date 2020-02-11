const titresSansPhase = [
  {
    id: 'h-cx-courdemanges-1988',
    demarches: [
      {
        id: 'h-cx-courdemanges-1988-oct01',
        titreId: 'h-cx-courdemanges-1988',
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
    id: 'h-cx-courdemanges-1988',
    demarches: [
      {
        id: 'h-cx-courdemanges-1988-oct01',
        titreId: 'h-cx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        etapes: [
          {
            id: 'h-cx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '2200-01-01',
            dateFin: '2500-01-01'
          },
          {
            id: 'h-cx-courdemanges-1988-oct01-dex01',
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

const titrePhase = [
  {
    titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
    dateFin: '2500-01-01',
    dateDebut: '2200-01-01',
    statutId: 'val'
  }
]

const titresUnePhaseMiseAJour = [
  {
    id: 'h-cx-courdemanges-1988',
    demarches: [
      {
        id: 'h-cx-courdemanges-1988-oct01',
        titreId: 'h-cx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        phase: {
          titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
          dateFin: '2500-01-01',
          dateDebut: new Date('2300-01-01'),
          statutId: 'val'
        },
        etapes: [
          {
            id: 'h-cx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '2200-01-01',
            dateFin: '2500-01-01'
          },
          {
            id: 'h-cx-courdemanges-1988-oct01-dex01',
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

const titresPhaseASupprimer = [
  {
    id: 'h-cx-courdemanges-1988',
    demarches: [
      {
        id: 'h-cx-courdemanges-1988-oct01',
        titreId: 'h-cx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        phase: {
          titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
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
    id: 'h-cx-courdemanges-1988',
    demarches: [
      {
        id: 'h-cx-courdemanges-1988-oct01',
        titreId: 'h-cx-courdemanges-1988',
        typeId: 'oct',
        statutId: 'acc',
        ordre: 1,
        phase: {
          titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
          dateFin: '2500-01-01',
          dateDebut: '2200-01-01',
          statutId: 'val'
        },
        etapes: [
          {
            id: 'h-cx-courdemanges-1988-oct01-dpu01',
            typeId: 'dpu',
            statutId: 'acc',
            ordre: 2,
            date: '2200-01-01',
            dateFin: '2500-01-01'
          },
          {
            id: 'h-cx-courdemanges-1988-oct01-dex01',
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
  titrePhase,
  titresUnePhaseMiseAJour,
  titresPhaseASupprimer,
  titresUnePhaseSansChangement
}
