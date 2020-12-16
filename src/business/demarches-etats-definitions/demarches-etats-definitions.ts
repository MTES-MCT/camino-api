import { etatsDefinitionArmRet } from './arm/ret'
import { ITitreCondition } from '../../types'
import { etatsDefinitionArmOct } from './arm/oct'
import { etatsDefinitionArmRenPro } from './arm/ren-pro'
import { etatsDefinitionAxmOct } from './axm/oct'
// import { etatsDefinitionPrmOct } from './prm/oct'

interface IEtatIdCondition {
  etatId?: string
  statutId?: string
  titre?: ITitreCondition
}

interface IEtatIdDefinition {
  etatId: string
  separation?: string[]
  justeApres: IEtatIdCondition[][]
  avant?: IEtatIdCondition[][]
  apres?: IEtatIdCondition[][]
}

interface IDemarcheEtatsDefinition {
  titreTypeId: string
  demarcheTypeIds: string[]
  restrictions: IEtatIdDefinition[]
}

const demarchesEtatsDefinitions: IDemarcheEtatsDefinition[] = [
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

const demarcheEtatsDefinitionGet = (
  titreTypeId: string,
  demarcheTypeId: string
) => {
  return demarchesEtatsDefinitions.find(
    r =>
      r.titreTypeId === titreTypeId &&
      (r.demarcheTypeIds.includes(demarcheTypeId) || !demarcheTypeId)
  )
}

const etatIdsGet = (
  titreTypeId: string,
  demarcheTypeId: string,
  etapeTypeId: string
) => {
  const demarcheEtatsDefinition = demarcheEtatsDefinitionGet(
    titreTypeId,
    demarcheTypeId
  )

  if (!demarcheEtatsDefinition) {
    return [etapeTypeId]
  }

  return demarcheEtatsDefinition.restrictions
    .filter(r => r.etatId.startsWith(etapeTypeId))
    .map(r => r.etatId)
}

export {
  demarchesEtatsDefinitions,
  demarcheEtatsDefinitionGet,
  etatIdsGet,
  IEtatIdDefinition,
  IEtatIdCondition,
  IDemarcheEtatsDefinition
}
