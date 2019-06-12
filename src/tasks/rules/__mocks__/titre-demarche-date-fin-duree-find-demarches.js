const titreDemarchesOctDateFin = [
  {
    id: 'h-cxx-courdemanges-1988-pro01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-pro01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-pro01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21T22:00:00.000Z',
        dateFin: '2038-03-11T23:00:00.000Z',
        duree: 25
      }
    ]
  },
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11T23:00:00.000Z'
      },
      {
        id: 'h-cxx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z',
        dateFin: '2013-03-11T23:00:00.000Z'
      }
    ]
  }
]

const titreDemarchesOctDateDebut = [
  {
    id: 'h-cxx-courdemanges-1988-pro01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-pro01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-pro01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21T22:00:00.000Z',
        dateFin: '2038-03-11T23:00:00.000Z',
        duree: 25
      }
    ]
  },
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11T23:00:00.000Z'
      },
      {
        id: 'h-cxx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z',
        dateDebut: '2013-03-11T23:00:00.000Z',
        duree: 10
      }
    ]
  }
]

const titreDemarchesOctDureeZero = [
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z',
        duree: 0,
        points: []
      }
    ]
  }
]

const titreDemarchesOctPasDeDpu = [
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z',
        duree: 25
      }
    ]
  }
]

const titreDemarchesOctDpuFirst = [
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z',
        duree: 25
      }
    ]
  }
]

const titreDemarchesOctNiDpuNiDex = [
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'rpu',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z',
        duree: 25
      }
    ]
  }
]

const titreDemarchesOctProDuree = [
  {
    id: 'h-cxx-courdemanges-1988-pro01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-pro01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-pro01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2013-05-23T22:00:00.000Z',
        duree: null
      },
      {
        id: 'h-cxx-courdemanges-1988-pro01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-pro01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21T22:00:00.000Z',
        duree: 25
      }
    ]
  },
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11T23:00:00.000Z',
        duree: null
      },
      {
        id: 'h-cxx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z',
        dateFin: '2013-03-11T23:00:00.000Z',
        duree: 25
      }
    ]
  }
]

const titreDemarchesOctAbrDateFin = [
  {
    id: 'h-cxx-courdemanges-1988-abr01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'abr',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-abr01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-abr01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2013-05-23T22:00:00.000Z',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cxx-courdemanges-1988-abr01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-abr01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21T22:00:00.000Z',
        dateFin: '2200-03-11T23:00:00.000Z'
      }
    ]
  },
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11T23:00:00.000Z',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cxx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z',
        dateFin: '2013-03-11T23:00:00.000Z',
        duree: 25
      }
    ]
  }
]

const titreDemarchesOctAbrDate = [
  {
    id: 'h-cxx-courdemanges-1988-abr01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'abr',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-abr01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-abr01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2013-05-23T22:00:00.000Z',
        duree: null
      },
      {
        id: 'h-cxx-courdemanges-1988-abr01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-abr01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21T22:00:00.000Z',
        duree: 50
      }
    ]
  },
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11T23:00:00.000Z',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cxx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z',
        duree: 25
      }
    ]
  }
]

const titreDemarchesRenPoints = [
  {
    id: 'h-cxx-courdemanges-1988-ren01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-ren01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-ren01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-06-06T23:00:00.000Z',
        points: [1, 2, 3]
      }
    ]
  },
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11T23:00:00.000Z',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cxx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z',
        duree: 25
      }
    ]
  }
]

const titreDemarchesRenPointsVideDpu = [
  {
    id: 'h-cxx-courdemanges-1988-ren01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-ren01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-ren01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-06-17T23:00:00.000Z',
        points: []
      },
      {
        id: 'h-cxx-courdemanges-1988-ren01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-ren01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-06-06T23:00:00.000Z',
        points: []
      }
    ]
  },
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11T23:00:00.000Z',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cxx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06T23:00:00.000Z',
        duree: 25
      }
    ]
  }
]

const titreDemarchesRenPointsVideDex = [
  {
    id: 'h-cxx-courdemanges-1988-ren01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-ren01-dex01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-ren01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-06-06T23:00:00.000Z',
        points: []
      }
    ]
  }
]

const titreDemarchesRenPointsVideNiDpuNiDex = [
  {
    id: 'h-cxx-courdemanges-1988-ren01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-ren01-mfr01',
        titreDemarcheId: 'h-cxx-courdemanges-1988-ren01',
        typeId: 'mfr',
        statutId: 'acc',
        ordre: 1,
        date: '1988-06-06T23:00:00.000Z',
        points: []
      }
    ]
  }
]

export {
  titreDemarchesOctDateFin,
  titreDemarchesOctDateDebut,
  titreDemarchesOctDureeZero,
  titreDemarchesOctPasDeDpu,
  titreDemarchesOctDpuFirst,
  titreDemarchesOctNiDpuNiDex,
  titreDemarchesOctProDuree,
  titreDemarchesOctAbrDateFin,
  titreDemarchesOctAbrDate,
  titreDemarchesRenPoints,
  titreDemarchesRenPointsVideDpu,
  titreDemarchesRenPointsVideDex,
  titreDemarchesRenPointsVideNiDpuNiDex
}
