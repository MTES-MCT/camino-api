const titreDemarcheMut = {
  id: 'h-cxx-courdemanges-1988-mut01',
  titreId: 'h-cxx-courdemanges-1988',
  typeId: 'mut',
  statutId: 'acc',
  etapes: []
}

const titreDemarcheOctRej = {
  id: 'h-cxx-courdemanges-1988-oct01',
  titreId: 'h-cxx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'rej',
  etapes: []
}

const titreDemarcheOctDpuInexistante = {
  id: 'h-cxx-courdemanges-1988-oct01',
  titreId: 'h-cxx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cxx-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
}

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
      ordre: 2
    },
    {
      id: 'h-cxx-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
}

const titreDemarcheOctDpuRej = {
  id: 'h-cxx-courdemanges-1988-oct01',
  titreId: 'h-cxx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cxx-courdemanges-1988-oct01-dpu01',
      typeId: 'dpu',
      statutId: 'rej',
      ordre: 2
    },
    {
      id: 'h-cxx-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'rej',
      ordre: 1
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
      ordre: 1
    }
  ]
}

const titreAxmDemarcheOctDexRej = {
  id: 'h-axm-courdemanges-1988-oct01',
  titreId: 'h-axm-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-axm-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'rej',
      ordre: 1
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
      ordre: 1
    }
  ]
}

const titrePrxDemarcheOctRpuRej = {
  id: 'h-prx-courdemanges-1988-oct01',
  titreId: 'h-prx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-prx-courdemanges-1988-oct01-rpu01',
      typeId: 'rpu',
      statutId: 'rej',
      ordre: 1
    }
  ]
}

const titreDemarcheProDpuAcc = {
  id: 'h-cxx-courdemanges-1988-pro01',
  titreId: 'h-cxx-courdemanges-1988',
  typeId: 'pro',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cxx-courdemanges-1988-pro01-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2
    },
    {
      id: 'h-cxx-courdemanges-1988-pro01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
}

const titreDemarchePro1DpuAcc = {
  id: 'h-cxx-courdemanges-1988-pr101',
  titreId: 'h-cxx-courdemanges-1988',
  typeId: 'pr1',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cxx-courdemanges-1988-pr101-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2
    },
    {
      id: 'h-cxx-courdemanges-1988-pr101-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
}

const titreDemarchePro2DpuAcc = {
  id: 'h-cxx-courdemanges-1988-pr201',
  titreId: 'h-cxx-courdemanges-1988',
  typeId: 'pr2',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cxx-courdemanges-1988-pr201-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2
    },
    {
      id: 'h-cxx-courdemanges-1988-pr201-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
}

const titreDemarchePreDpuAcc = {
  id: 'h-cxx-courdemanges-1988-pre01',
  titreId: 'h-cxx-courdemanges-1988',
  typeId: 'pre',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cxx-courdemanges-1988-pre01-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2
    },
    {
      id: 'h-cxx-courdemanges-1988-pre01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
}

export {
  titreDemarcheMut,
  titreDemarcheOctRej,
  titreDemarcheOctDpuInexistante,
  titreDemarcheOctDpuAcc,
  titreDemarcheOctDpuRej,
  titreAxmDemarcheOctDexAcc,
  titreAxmDemarcheOctDexRej,
  titrePrxDemarcheOctRpuAcc,
  titrePrxDemarcheOctRpuRej,
  titreDemarcheProDpuAcc,
  titreDemarchePro1DpuAcc,
  titreDemarchePro2DpuAcc,
  titreDemarchePreDpuAcc
}
