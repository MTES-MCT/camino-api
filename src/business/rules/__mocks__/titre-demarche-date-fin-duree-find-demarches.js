const titreDemarchesOctDateFin = [
  {
    id: 'h-cx-courdemanges-1988-pro01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-pro01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-pro01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21',
        dateFin: '2038-03-11',
        duree: 25 * 12
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11'
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        dateFin: '2013-03-11'
      }
    ]
  }
]

const titreDemarchesOctDateDebut = [
  {
    id: 'h-cx-courdemanges-1988-pro01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-pro01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-pro01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21',
        dateFin: '2038-03-11',
        duree: 25 * 12
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11'
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        dateDebut: '2013-03-11',
        duree: 10 * 12
      }
    ]
  }
]

const titreDemarchesOctDureeZero = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 0,
        points: []
      }
    ]
  }
]

const titreDemarchesOctPasDeDpu = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 25 * 12
      }
    ]
  }
]

const titreDemarchesOctDpuFirst = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 25 * 12
      }
    ]
  }
]

const titreDemarchesOctNiDpuNiDex = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'rpu',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 25 * 12
      }
    ]
  }
]

const titreDemarchesOctProDuree = [
  {
    id: 'h-cx-courdemanges-1988-pro01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-pro01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-pro01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2013-05-23',
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-pro01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-pro01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21',
        duree: 25 * 12
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11',
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        dateFin: '2013-03-11',
        duree: 25 * 12
      }
    ]
  }
]

const titreDemarchesOctAbrDateFin = [
  {
    id: 'h-cx-courdemanges-1988-abr01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'abr',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-abr01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-abr01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2013-05-23',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-abr01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-abr01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21',
        dateFin: '2200-03-11'
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        dateFin: '2013-03-11',
        duree: 25 * 12
      }
    ]
  }
]

const titreDemarchesOctAbrDate = [
  {
    id: 'h-cx-courdemanges-1988-abr01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'abr',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-abr01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-abr01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2013-05-23',
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-abr01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-abr01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2013-05-21',
        duree: 50 * 12
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 25 * 12
      }
    ]
  }
]

const titreDemarchesRenPoints = [
  {
    id: 'h-cx-courdemanges-1988-ren01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-ren01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-ren01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-06-06',
        points: [1, 2, 3]
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 25 * 12
      }
    ]
  }
]

const titreDemarchesRenPointsVideDpu = [
  {
    id: 'h-cx-courdemanges-1988-ren01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-ren01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-ren01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-06-17',
        points: []
      },
      {
        id: 'h-cx-courdemanges-1988-ren01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-ren01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-06-06',
        points: []
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    ordre: 1,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11',
        dateFin: null,
        duree: null
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06',
        duree: 25 * 12
      }
    ]
  }
]

const titreDemarchesRenPointsVideDex = [
  {
    id: 'h-cx-courdemanges-1988-ren01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-ren01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-ren01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-06-06',
        points: []
      }
    ]
  }
]

const titreDemarchesRenPointsVideNiDpuNiDex = [
  {
    id: 'h-cx-courdemanges-1988-ren01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-ren01-mfr01',
        titreDemarcheId: 'h-cx-courdemanges-1988-ren01',
        typeId: 'mfr',
        statutId: 'acc',
        ordre: 1,
        date: '1988-06-06',
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
