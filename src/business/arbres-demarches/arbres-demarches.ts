import { arbreArmRet } from './arm/ret'
import { ITitreCondition } from '../../types'
import { arbreArmOct } from './arm/oct'
import { arbreArmRenPro } from './arm/ren-pro'
import { arbreAxmOct } from './axm/oct'
// import { arbrePrmOct } from './prm/oct'

interface IArbreCondition {
  arbreTypeId?: string
  statutId?: string
  titre?: ITitreCondition
  impossible?: boolean
}

interface IArbreEtape {
  arbreTypeId: string
  separation?: string[]
  justeApres: IArbreCondition[][]
  avant?: IArbreCondition[][]
  apres?: IArbreCondition[][]
}

interface IArbresDemarches {
  titreTypeId: string
  demarcheTypeIds: string[]
  restrictions: IArbreEtape[]
}

const arbresDemarches: IArbresDemarches[] = [
  {
    titreTypeId: 'arm',
    demarcheTypeIds: ['oct'],
    restrictions: arbreArmOct
  },
  {
    titreTypeId: 'arm',
    demarcheTypeIds: ['ret'],
    restrictions: arbreArmRet
  },
  {
    titreTypeId: 'arm',
    demarcheTypeIds: ['ren', 'pro'],
    restrictions: arbreArmRenPro
  },
  // {
  //   titreTypeId: 'prm',
  //   demarcheTypeIds: ['oct'],
  //   restrictions: arbrePrmOct
  // },
  {
    titreTypeId: 'axm',
    demarcheTypeIds: ['oct'],
    restrictions: arbreAxmOct
  }
]

const arbreDemarcheGet = (titreTypeId: string, demarcheTypeId: string) => {
  return arbresDemarches.find(
    r =>
      r.titreTypeId === titreTypeId &&
      (r.demarcheTypeIds.includes(demarcheTypeId) || !demarcheTypeId)
  )
}

const arbreTypeIdsGet = (
  titreTypeId: string,
  demarcheTypeId: string,
  etapeTypeId: string
) => {
  const arbreDemarche = arbreDemarcheGet(titreTypeId, demarcheTypeId)

  if (!arbreDemarche) {
    return [etapeTypeId]
  }

  return arbreDemarche.restrictions
    .filter(r => r.arbreTypeId.startsWith(etapeTypeId))
    .map(r => r.arbreTypeId)
}

export {
  arbresDemarches,
  arbreDemarcheGet,
  arbreTypeIdsGet,
  IArbreEtape,
  IArbreCondition,
  IArbresDemarches
}
