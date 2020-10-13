import { ITitreDemarche } from '../../../types'

const titreDemarcheOctDpuAcc = {
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2,
      date: '2200-01-01',
      duree: 2 * 12
    },
    {
      id: 'h-cx-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1,
      date: '2200-01-01',
      duree: 2 * 12
    }
  ]
} as ITitreDemarche

const titreDemarcheOctDpuInexistante = {
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: []
} as ITitreDemarche

const titreAxmDemarcheOctDexAcc = {
  id: 'h-ax-courdemanges-1988-oct01',
  titreId: 'h-ax-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-ax-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1,
      date: '2200-01-01',
      duree: 2 * 12
    }
  ]
} as ITitreDemarche

const titrePrmDemarcheOctRpuAcc = {
  id: 'm-pr-courdemanges-1988-oct01',
  titreId: 'm-pr-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'm-pr-courdemanges-1988-oct01-rpu01',
      typeId: 'rpu',
      statutId: 'acc',
      ordre: 1,
      date: '2200-01-01',
      dateFin: '2200-01-02'
    }
  ]
} as ITitreDemarche

const titreDemarcheOctDpuDateDebut = {
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2,
      date: '2200-01-01',
      dateDebut: '2200-01-02',
      duree: 2 * 12
    },
    {
      id: 'h-cx-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1,
      date: '2200-01-01',
      dateDebut: '2200-01-02',
      duree: 2 * 12
    }
  ]
} as ITitreDemarche

const titreDemarchesOctProlongation = [
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
  },
  {
    id: 'h-cx-courdemanges-1988-pro01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'pro',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-pro01-dpu01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2019-01-02',
        dateFin: '3000-01-01'
      },
      {
        id: 'h-cx-courdemanges-1988-pro01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2019-01-02',
        dateFin: '3000-01-01'
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctAnnulation = [
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
        date: '2000-01-02',
        duree: 20 * 12
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2000-01-01',
        duree: 20 * 12
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-ren01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-ren01-dpu01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2019-01-03'
      },
      {
        id: 'h-cx-courdemanges-1988-ren01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2019-01-02'
      }
    ]
  }
] as ITitreDemarche[]

const titreDemarchesOctAnnulationSansPoints = [
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
        date: '2000-01-02',
        duree: 20 * 12
      },
      {
        id: 'h-cx-courdemanges-1988-oct01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2000-01-01',
        duree: 20 * 12
      }
    ]
  },
  {
    id: 'h-cx-courdemanges-1988-ren01',
    titreId: 'h-cx-courdemanges-1988',
    typeId: 'ren',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cx-courdemanges-1988-ren01-dpu01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2019-01-03'
      },
      {
        id: 'h-cx-courdemanges-1988-ren01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2019-01-02',
        points: [{ id: 'point' }]
      }
    ]
  }
] as ITitreDemarche[]

export {
  titreDemarcheOctDpuAcc,
  titreDemarcheOctDpuInexistante,
  titreAxmDemarcheOctDexAcc,
  titrePrmDemarcheOctRpuAcc,
  titreDemarcheOctDpuDateDebut,
  titreDemarchesOctProlongation,
  titreDemarchesOctAnnulation,
  titreDemarchesOctAnnulationSansPoints
}
