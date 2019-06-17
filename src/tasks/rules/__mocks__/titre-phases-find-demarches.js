const titreDemarcheOctDpuAcc = {
  id: 'h-cxx-courdemanges-1988-oct01',
  titreId: 'h-cxx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cxx-courdemanges-1988-oct01-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2,
      date: '2200-01-01',
      duree: 2 * 12
    },
    {
      id: 'h-cxx-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1,
      date: '2200-01-01',
      duree: 2 * 12
    }
  ]
}

const titreAxmDemarcheOctDexAcc = {
  id: 'h-axm-courdemanges-1988-oct01',
  titreId: 'h-axm-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-axm-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1,
      date: '2200-01-01',
      duree: 2 * 12
    }
  ]
}

const titrePrxDemarcheOctRpuAcc = {
  id: 'h-prx-courdemanges-1988-oct01',
  titreId: 'h-prx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-prx-courdemanges-1988-oct01-rpu01',
      typeId: 'rpu',
      statutId: 'acc',
      ordre: 1,
      date: '2200-01-01',
      dateFin: '2200-01-02'
    }
  ]
}

const titreDemarcheOctDpuDateDebut = {
  id: 'h-cxx-courdemanges-1988-oct01',
  titreId: 'h-cxx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cxx-courdemanges-1988-oct01-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2,
      date: '2200-01-01',
      dateDebut: '2200-01-02',
      duree: 2 * 12
    },
    {
      id: 'h-cxx-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1,
      date: '2200-01-01',
      dateDebut: '2200-01-02',
      duree: 2 * 12
    }
  ]
}

const titreDemarchesOctProlongation = [
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

const titreDemarchesOctAnnulation = [
  {
    id: 'h-cxx-courdemanges-1988-oct01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'oct',
    statutId: 'acc',
    annulationTitreDemarcheId: 'h-cxx-courdemanges-1988-ret01',
    ordre: 1,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-oct01-dpu01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2200-01-01'
      },
      {
        id: 'h-cxx-courdemanges-1988-oct01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2200-01-01'
      }
    ]
  },
  {
    id: 'h-cxx-courdemanges-1988-ret01',
    titreId: 'h-cxx-courdemanges-1988',
    typeId: 'ret',
    statutId: 'acc',
    ordre: 2,
    etapes: [
      {
        id: 'h-cxx-courdemanges-1988-ret01-dpu01',
        typeId: 'dpu',
        statutId: 'acc',
        ordre: 2,
        date: '2019-01-02'
      },
      {
        id: 'h-cxx-courdemanges-1988-ret01-dex01',
        typeId: 'dex',
        statutId: 'acc',
        ordre: 1,
        date: '2019-01-02'
      }
    ]
  }
]

export {
  titreDemarcheOctDpuAcc,
  titreAxmDemarcheOctDexAcc,
  titrePrxDemarcheOctRpuAcc,
  titreDemarcheOctDpuDateDebut,
  titreDemarchesOctProlongation,
  titreDemarchesOctAnnulation
}
