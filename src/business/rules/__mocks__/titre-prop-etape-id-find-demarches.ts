import { ITitreDemarche } from '../../../types'

const titreDemarchesOctPointsMut = {
  statutId: 'val',
  demarches: [
    {
      id: 'h-cx-courdemanges-1989-oct01',
      titreId: 'h-cx-courdemanges-1989',
      typeId: 'oct',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1989-oct01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1989-oct01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 2,
          points: [1, 2, 3]
        },
        {
          id: 'h-cx-courdemanges-1989-oct01-dex01',
          titreDemarcheId: 'h-cx-courdemanges-1989-oct01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ]
    },
    {
      id: 'h-cx-courdemanges-1989-mut01',
      titreId: 'h-cx-courdemanges-1989',
      typeId: 'mut',
      statutId: 'acc',
      ordre: 2,
      etapes: [
        {
          id: 'h-cx-courdemanges-1989-mut01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1989-mut01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 2
        },
        {
          id: 'h-cx-courdemanges-1989-mut01-dex01',
          titreDemarcheId: 'h-cx-courdemanges-1989-mut01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ]
    }
  ] as ITitreDemarche[]
}

const titreDemarchesOctPointsVides = {
  statutId: 'val',
  demarches: [
    {
      id: 'h-cx-courdemanges-1988-oct01',
      titreId: 'h-cx-courdemanges-1988',
      typeId: 'oct',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1988-oct01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 2,
          points: []
        },
        {
          id: 'h-cx-courdemanges-1988-oct01-dex01',
          titreDemarcheId: 'h-cx-courdemanges-1988-oct01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ]
    }
  ] as ITitreDemarche[]
}

const titreDemarchesOctMutPoints = {
  statutId: 'val',
  demarches: [
    {
      id: 'h-cx-courdemanges-1986-oct01',
      titreId: 'h-cx-courdemanges-1986',
      typeId: 'oct',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1986-oct01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1986-oct01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 2
        },
        {
          id: 'h-cx-courdemanges-1986-oct01-dex01',
          titreDemarcheId: 'h-cx-courdemanges-1986-oct01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ]
    },
    {
      id: 'h-cx-courdemanges-1986-mut01',
      titreId: 'h-cx-courdemanges-1986',
      typeId: 'mut',
      statutId: 'acc',
      ordre: 2,
      etapes: [
        {
          id: 'h-cx-courdemanges-1986-mut01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1986-mut01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 2,
          points: [1, 2, 3]
        },
        {
          id: 'h-cx-courdemanges-1986-mut01-dex01',
          titreDemarcheId: 'h-cx-courdemanges-1986-mut01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ]
    }
  ] as ITitreDemarche[]
}

const titreDemarchesOctPointsMutInstruction = {
  statutId: 'val',
  demarches: ([
    {
      id: 'h-cx-courdemanges-1985-mut01',
      titreId: 'h-cx-courdemanges-1985',
      typeId: 'mut',
      statutId: 'ins',
      ordre: 2,
      etapes: [
        {
          id: 'h-cx-courdemanges-1985-mut01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1985-mut01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 2,
          points: [1, 2, 3]
        },
        {
          id: 'h-cx-courdemanges-1985-mut01-dex01',
          titreDemarcheId: 'h-cx-courdemanges-1985-mut01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ]
    },
    {
      id: 'h-cx-courdemanges-1985-oct01',
      titreId: 'h-cx-courdemanges-1985',
      typeId: 'oct',
      statutId: 'ins',
      etapes: [
        {
          id: 'h-cx-courdemanges-1985-oct01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1985-oct01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 2,
          points: [1, 2, 3]
        },
        {
          id: 'h-cx-courdemanges-1985-oct01-dex01',
          titreDemarcheId: 'h-cx-courdemanges-1985-oct01',
          typeId: 'dex',
          statutId: 'acc',
          ordre: 1
        }
      ]
    }
  ] as unknown) as ITitreDemarche[]
}

const titreDemarchesOctAccDpuRej = {
  statutId: 'val',
  demarches: ([
    {
      id: 'h-cx-courdemanges-1984-oct01',
      titreId: 'h-cx-courdemanges-1984',
      typeId: 'oct',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1984-oct01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1984-oct01',
          typeId: 'dpu',
          statutId: 'rej',
          ordre: 2,
          points: [1, 2, 3]
        },
        {
          id: 'h-cx-courdemanges-1984-oct01-dex01',
          titreDemarcheId: 'h-cx-courdemanges-1984-oct01',
          typeId: 'dex',
          statutId: 'rej',
          ordre: 1
        }
      ]
    }
  ] as unknown) as ITitreDemarche[]
}

const titreDemarchesOctMfrPoints = {
  statutId: 'val',
  demarches: ([
    {
      id: 'h-cx-courdemanges-1983-oct01',
      titreId: 'h-cx-courdemanges-1983',
      typeId: 'oct',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1983-oct01-mfr01',
          titreDemarcheId: 'h-cx-courdemanges-1983-oct01',
          typeId: 'mfr',
          statutId: 'acc',
          ordre: 1,
          points: [1, 2, 3]
        }
      ]
    }
  ] as unknown) as ITitreDemarche[]
}

const titreDemarchesOctAmodiatairesPassee = {
  statutId: 'val',
  demarches: [
    {
      id: 'h-cx-courdemanges-1982-oct01',
      titreId: 'h-cx-courdemanges-1982',
      typeId: 'oct',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1982-oct01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1982-oct01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1,
          dateFin: '2018-12-31',
          amodiataires: [{ id: 'fr-123456789' }]
        }
      ]
    }
  ] as ITitreDemarche[]
}

const titreDemarchesOctAmodiatairesValide = {
  statutId: 'mod',
  demarches: [
    {
      id: 'h-cx-courdemanges-1982-oct01',
      titreId: 'h-cx-courdemanges-1982',
      typeId: 'oct',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1982-oct01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1982-oct01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1,
          dateFin: '4018-12-31',
          amodiataires: [{ id: 'fr-123456789' }]
        }
      ]
    }
  ] as ITitreDemarche[]
}

const titreDemarchesOctAmodiatairesMod = {
  statutId: 'mod',
  demarches: ([
    {
      id: 'h-cx-courdemanges-1981-amo01',
      titreId: 'h-cx-courdemanges-1981',
      typeId: 'amo',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1981-amo01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1981-amo01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1,
          amodiataires: [{ id: 'fr-123456789' }]
        }
      ]
    },
    {
      id: 'h-cx-courdemanges-1981-pro01',
      titreId: 'h-cx-courdemanges-1981',
      typeId: 'pro',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1981-pro01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1981-pro01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1
        }
      ]
    },
    {
      id: 'h-cx-courdemanges-1981-oct01',
      titreId: 'h-cx-courdemanges-1981',
      typeId: 'oct',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1981-oct01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1981-oct01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1
        }
      ]
    }
  ] as unknown) as ITitreDemarche[]
}

const titreDemarchesProPointsModPhaseEch = {
  statutId: 'mod',
  demarches: ([
    {
      id: 'h-cx-courdemanges-1981-pro01',
      titreId: 'h-cx-courdemanges-1981',
      typeId: 'pro',
      statutId: 'ins',
      etapes: [
        {
          id: 'h-cx-courdemanges-1981-pro01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1981-pro01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1,
          points: [1, 2, 3]
        }
      ],
      phase: {
        statutId: 'ech'
      }
    },
    {
      id: 'h-cx-courdemanges-1981-oct01',
      titreId: 'h-cx-courdemanges-1981',
      typeId: 'oct',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1981-oct01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1981-oct01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1
        }
      ]
    }
  ] as unknown) as ITitreDemarche[]
}

const titreDemarchesProPointsModPhaseVal = {
  statutId: 'mod',
  demarches: ([
    {
      id: 'h-cx-courdemanges-1981-pro01',
      titreId: 'h-cx-courdemanges-1981',
      typeId: 'pro',
      statutId: 'ins',
      etapes: [
        {
          id: 'h-cx-courdemanges-1981-pro01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1981-pro01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1,
          points: [1, 2, 3]
        }
      ],
      phase: {
        statutId: 'val'
      }
    },
    {
      id: 'h-cx-courdemanges-1981-oct01',
      titreId: 'h-cx-courdemanges-1981',
      typeId: 'oct',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1981-oct01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1981-oct01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1
        }
      ]
    }
  ] as unknown) as ITitreDemarche[]
}

const titreDemarchesMutPointsMod = {
  statutId: 'mod',
  demarches: ([
    {
      id: 'h-cx-courdemanges-1981-mut01',
      titreId: 'h-cx-courdemanges-1981',
      typeId: 'mut',
      statutId: 'ins',
      etapes: [
        {
          id: 'h-cx-courdemanges-1981-mut01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1981-mut01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1,
          points: [1, 2, 3]
        }
      ],
      phase: {
        statutId: 'val'
      }
    },
    {
      id: 'h-cx-courdemanges-1981-oct01',
      titreId: 'h-cx-courdemanges-1981',
      typeId: 'oct',
      statutId: 'acc',
      etapes: [
        {
          id: 'h-cx-courdemanges-1981-oct01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1981-oct01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1
        }
      ]
    }
  ] as unknown) as ITitreDemarche[]
}

const titreDemarchesProModPhaseEch = {
  statutId: 'mod',
  demarches: ([
    {
      id: 'h-cx-courdemanges-1981-pro01',
      titreId: 'h-cx-courdemanges-1981',
      typeId: 'pro',
      statutId: 'ins',
      ordre: 2,
      etapes: [
        {
          id: 'h-cx-courdemanges-1981-pro01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1981-pro01',
          typeId: 'eee',
          statutId: 'acc',
          ordre: 1,
          points: [1, 2, 3],
          surface: 3.2,
          substances: [{ id: 'or' }],
          communes: ['paris'],
          titulaires: ['titulaire2'],
          amodiataires: ['amodiataire2'],
          administrations: ['administration2']
        }
      ],
      phase: {
        statutId: 'ech'
      }
    },
    {
      id: 'h-cx-courdemanges-1981-oct01',
      titreId: 'h-cx-courdemanges-1981',
      typeId: 'oct',
      statutId: 'acc',
      ordre: 1,
      etapes: [
        {
          id: 'h-cx-courdemanges-1981-oct01-dpu01',
          titreDemarcheId: 'h-cx-courdemanges-1981-oct01',
          typeId: 'dpu',
          statutId: 'acc',
          ordre: 1,
          points: [1, 2],
          surface: 3,
          substances: [{ id: 'argent' }],
          communes: ['tours'],
          titulaires: ['titulaire1'],
          amodiataires: ['amodiataire1'],
          administrations: ['administration1']
        }
      ]
    }
  ] as unknown) as ITitreDemarche[]
}

export {
  titreDemarchesOctPointsMut,
  titreDemarchesOctPointsVides,
  titreDemarchesOctMutPoints,
  titreDemarchesOctPointsMutInstruction,
  titreDemarchesOctAccDpuRej,
  titreDemarchesOctMfrPoints,
  titreDemarchesOctAmodiatairesPassee,
  titreDemarchesOctAmodiatairesValide,
  titreDemarchesOctAmodiatairesMod,
  titreDemarchesProPointsModPhaseEch,
  titreDemarchesProPointsModPhaseVal,
  titreDemarchesMutPointsMod,
  titreDemarchesProModPhaseEch
}
