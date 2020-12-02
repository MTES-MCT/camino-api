import { ITitreDemarche } from '../../../types'

const titreDemarchesNoEtapesSortedAsc = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-mut01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: [],
    type: { ordre: 1 }
  },
  {
    id: 'h-cx-courdemanges-1988-mut02',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: []
  }
] as ITitreDemarche[]

const titreDemarchesNoEtapesSortedDesc = [
  {
    id: 'h-cx-courdemanges-1988-mut02',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: []
  },
  {
    id: 'h-cx-courdemanges-1988-mut01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: [],
    type: { ordre: 1 }
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesNoEtapesSortedAscResult = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-mut01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: [],
    type: { ordre: 1 }
  },
  {
    id: 'h-cx-courdemanges-1988-mut02',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: []
  }
] as ITitreDemarche[]

const titreDemarchesNoEtapesSortedDescResult = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-mut01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: [],
    type: { ordre: 1 }
  },
  {
    id: 'h-cx-courdemanges-1988-mut02',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: []
  }
] as ITitreDemarche[]

const titreDemarchesSortedAsc = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11'
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-mut01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-mut01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-mut01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1994-09-28'
      },
      {
        id: 'h-cx-courdemanges-1988-mut01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-mut01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1994-09-29'
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesSortedDesc = [
  {
    id: 'h-cx-courdemanges-1988-mut01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-mut01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-mut01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1994-09-28'
      },
      {
        id: 'h-cx-courdemanges-1988-mut01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-mut01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1994-09-29'
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11'
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesSortedDescEqual = [
  {
    id: 'h-cx-courdemanges-1988-mut01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-mut01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-mut01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      },
      {
        id: 'h-cx-courdemanges-1988-mut01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-mut01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1994-09-29'
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11'
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesSortedAscResult = [
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11'
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-mut01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-mut01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-mut01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1994-09-28'
      },
      {
        id: 'h-cx-courdemanges-1988-mut01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-mut01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1994-09-29'
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesSortedDescEqualResult = [
  {
    id: 'h-cx-courdemanges-1988-mut01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'mut',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-mut01-dex01',
        titreDemarcheId: 'h-cx-courdemanges-1988-mut01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      },
      {
        id: 'h-cx-courdemanges-1988-mut01-dpu01',
        titreDemarcheId: 'h-cx-courdemanges-1988-mut01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1994-09-29'
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-oct01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '1988-03-06'
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dpu01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '1988-03-11'
      }
    ]
  }
] as ITitreDemarche[]

export {
  titreDemarchesNoEtapesSortedAsc,
  titreDemarchesNoEtapesSortedDesc,
  titreDemarchesNoEtapesSortedAscResult,
  titreDemarchesNoEtapesSortedDescResult,
  titreDemarchesSortedAsc,
  titreDemarchesSortedDesc,
  titreDemarchesSortedAscResult,
  titreDemarchesSortedDescEqual,
  titreDemarchesSortedDescEqualResult
}
