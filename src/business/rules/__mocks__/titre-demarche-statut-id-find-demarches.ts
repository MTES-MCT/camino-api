import { ITitreDemarche } from '../../../types'

const titreDemarcheSansEtapes = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: []
} as unknown) as ITitreDemarche

const titreDemarcheOctAnf = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-anf01',
      typeId: 'anf',
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

const titreArmDemarcheOctDefAcc = ({
  id: 'm-ar-courdemanges-1988-oct01',
  titreId: 'm-ar-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'm-ar-courdemanges-1988-oct01-def01',
      typeId: 'def',
      statutId: 'acc',
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

const titreDemarcheOctScoFai = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-sco01',
      typeId: 'sco',
      statutId: 'fai',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheOctDexAcc = ({
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

const titreDemarcheOctDexDpuAcc = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'acc',
      ordre: 2
    },
    {
      id: 'h-cx-courdemanges-1988-pro01-dpu01',
      typeId: 'dpu',
      statutId: 'acc',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheOctDexRej = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-dex01',
      typeId: 'dex',
      statutId: 'rej',
      ordre: 1
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheOctMenIns = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-men01',
      typeId: 'men',
      date: '1988-03-11'
    }
  ]
} as unknown) as ITitreDemarche

const titreArmDemarcheOctMdpIns = ({
  id: 'm-ar-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-mdp01',
      typeId: 'mdp',
      date: '1988-03-11'
    }
  ]
} as unknown) as ITitreDemarche

const titreArmDemarcheOctDefIns = ({
  id: 'm-ar-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-def01',
      typeId: 'def'
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheOctRet = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-ret01',
      typeId: 'ret'
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheOctMdp = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-mdp01',
      typeId: 'mdp'
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheOctMfr = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-mfr01',
      typeId: 'mfr'
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheOctMcrDef = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-mcr01',
      typeId: 'mcr',
      statutId: 'def'
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheOctMcrAcc = ({
  id: 'h-cx-courdemanges-1988-oct01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'oct',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-oct01-mcr01',
      typeId: 'mcr',
      statutId: 'acc',
      date: '1988-03-11'
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheRetDpuFai = ({
  id: 'h-cx-courdemanges-1988-ret01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'ret',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-ret01-ret01',
      typeId: 'dup',
      statutId: 'fai'
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheRetDpuIni = ({
  id: 'h-cx-courdemanges-1988-ret01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'ret',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-ret01-ret01',
      typeId: 'dpu'
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheRtd = ({
  id: 'h-cx-courdemanges-1988-ret01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'ret',
  statutId: 'acc',
  etapes: [
    {
      id: 'h-cx-courdemanges-1988-ret01-rtd01',
      typeId: 'rtd'
    }
  ]
} as unknown) as ITitreDemarche

const titreDemarcheIndefinie = ({
  id: 'h-cx-courdemanges-1988-ret01',
  titreId: 'h-cx-courdemanges-1988',
  typeId: 'ind',
  statutId: 'acc',
  etapes: [{ id: 'xxx', typeId: 'dpu', statutId: 'rej' }]
} as unknown) as ITitreDemarche

export {
  titreDemarcheSansEtapes,
  titreDemarcheOctAnf,
  titreDemarcheOctDpuAcc,
  titreAxmDemarcheOctDexAcc,
  titreArmDemarcheOctDefAcc,
  titrePrmDemarcheOctRpuAcc,
  titreDemarcheProDpuAcc,
  titreDemarcheOctScoFai,
  titreDemarcheOctDexAcc,
  titreDemarcheOctDexDpuAcc,
  titreDemarcheOctDexRej,
  titreDemarcheOctMenIns,
  titreArmDemarcheOctMdpIns,
  titreArmDemarcheOctDefIns,
  titreDemarcheOctRet,
  titreDemarcheOctMdp,
  titreDemarcheOctMfr,
  titreDemarcheOctMcrDef,
  titreDemarcheOctMcrAcc,
  titreDemarcheRetDpuFai,
  titreDemarcheRetDpuIni,
  titreDemarcheRtd,
  titreDemarcheIndefinie
}
