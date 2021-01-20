import { etatsDefinitionArmRet } from './arm/ret'
import { ITitreCondition } from '../../types'
import { etatsDefinitionArmOct } from './arm/oct'
import { etatsDefinitionArmRenPro } from './arm/ren-pro'
import { etatsDefinitionAxmOct } from './axm/oct'
// import { etatsDefinitionPrmOct } from './prm/oct'

interface IEtapeTypeIdCondition {
  etapeTypeId?: string
  statutId?: string
  titre?: ITitreCondition
}

interface IEtapeTypeIdDefinition {
  etapeTypeId: string
  separation?: string[]
  justeApres: IEtapeTypeIdCondition[][]
  avant?: IEtapeTypeIdCondition[][]
  apres?: IEtapeTypeIdCondition[][]
  final?: boolean
}

interface IDemarcheDefinition {
  titreTypeId: string
  demarcheTypeIds: string[]
  restrictions: IEtapeTypeIdDefinition[]
}

const demarchesDefinitions: IDemarcheDefinition[] = [
  {
    titreTypeId: 'arm',
    demarcheTypeIds: ['oct'],
    restrictions: etatsDefinitionArmOct
  },
  {
    titreTypeId: 'arm',
    demarcheTypeIds: ['ret'],
    restrictions: etatsDefinitionArmRet
  },
  {
    titreTypeId: 'arm',
    demarcheTypeIds: ['ren', 'pro'],
    restrictions: etatsDefinitionArmRenPro
  },
  // {
  //   titreTypeId: 'prm',
  //   demarcheTypeIds: ['oct'],
  //   restrictions: etatsDefinitionPrmOct
  // },
  {
    titreTypeId: 'axm',
    demarcheTypeIds: ['oct'],
    restrictions: etatsDefinitionAxmOct
  }
]

const etapeTypeIdDefinitionsGet = (
  titreTypeId: string,
  demarcheTypeId: string
) =>
  demarchesDefinitions.find(
    r =>
      r.titreTypeId === titreTypeId &&
      (r.demarcheTypeIds.includes(demarcheTypeId) || !demarcheTypeId)
  )?.restrictions

export {
  demarchesDefinitions,
  etapeTypeIdDefinitionsGet,
  IEtapeTypeIdDefinition,
  IEtapeTypeIdCondition,
  IDemarcheDefinition
}
