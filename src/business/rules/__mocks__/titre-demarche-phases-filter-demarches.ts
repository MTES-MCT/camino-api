import { ITitreDemarche } from '../../../types'

const titreDemarcheMut = ({
  id: 'h-cx-courdemanges-1988-mut01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'mut',
  statutId: 'acc',
  etapes: []
} as unknown) as ITitreDemarche

const titreDemarcheOctRej = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'rej',
  etapes: []
} as unknown) as ITitreDemarche

const titreDemarcheOctDpuInexistante = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheOctDpuAcc = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2
    },
    {
      id: 'h-cx-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheMutDateFinAcc = ({
  id: 'h-cx-courdemanges-1988-mut01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'mut',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-mut01-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 1,
      dateFin: '2018-12-31'
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheMutDureeAcc = ({
  id: 'h-cx-courdemanges-1988-mut01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'mut',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-mut01-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 1,
      duree: 20
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheOctDpuRej = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-dpu01',
      typeId: 'dpu',
      statutId: 'rej',
      ordre: 2
    },
    {
      id: 'h-cx-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'rej',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titreAxmDemarcheOctDexAcc = ({
  id: 'h-ax-courdemanges-1988-oct01',
  titreId: 'h-ax-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-ax-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titreAxmDemarcheOctDexRej = ({
  id: 'h-ax-courdemanges-1988-oct01',
  titreId: 'h-ax-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-ax-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'rej',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titrePrmDemarcheOctRpuAcc = ({
  id: 'm-pr-courdemanges-1988-oct01',
  titreId: 'm-pr-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'm-pr-courdemanges-1988-oct01-rpu01',
      typeId: 'rpu',
      statutId: 'acc',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titrePrmDemarcheOctRpuRej = ({
  id: 'm-pr-courdemanges-1988-oct01',
  titreId: 'm-pr-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'm-pr-courdemanges-1988-oct01-rpu01',
      typeId: 'rpu',
      statutId: 'rej',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheProDpuAcc = ({
  id: 'h-cx-courdemanges-1988-pro01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'pro',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-pro01-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2
    },
    {
      id: 'h-cx-courdemanges-1988-pro01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarchePro1DpuAcc = ({
  id: 'h-cx-courdemanges-1988-pr101',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'pr1',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-pr101-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2
    },
    {
      id: 'h-cx-courdemanges-1988-pr101-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarchePro2DpuAcc = ({
  id: 'h-cx-courdemanges-1988-pr201',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'pr2',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-pr201-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2
    },
    {
      id: 'h-cx-courdemanges-1988-pr201-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarchePreDpuAcc = ({
  id: 'h-cx-courdemanges-1988-pre01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'pre',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-pre01-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 2
    },
    {
      id: 'h-cx-courdemanges-1988-pre01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

export {
  titreDemarcheMut,
  titreDemarcheOctRej,
  titreDemarcheOctDpuInexistante,
  titreDemarcheMutDateFinAcc,
  titreDemarcheMutDureeAcc,
  titreDemarcheOctDpuAcc,
  titreDemarcheOctDpuRej,
  titreAxmDemarcheOctDexAcc,
  titreAxmDemarcheOctDexRej,
  titrePrmDemarcheOctRpuAcc,
  titrePrmDemarcheOctRpuRej,
  titreDemarcheProDpuAcc,
  titreDemarchePro1DpuAcc,
  titreDemarchePro2DpuAcc,
  titreDemarchePreDpuAcc
}
