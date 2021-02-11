import { restrictionsArmRet } from './arm/ret'
import { IContenuValeur } from '../../types'
import { restrictionsArmOct } from './arm/oct'
import { restrictionsArmRenPro } from './arm/ren-pro'
import { restrictionsAxmOct } from './axm/oct'
import { etatsDefinitionPrmOct } from './prm/oct'

interface IEtapeTypeIdCondition {
  etapeTypeId?: string
  statutId?: string
  titre?: ITitreCondition
}

interface IDemarcheDefinitionRestrictions {
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
  restrictions: IDemarcheDefinitionRestrictions[]
  dateDebut: string
}

type IContenuOperation = {
  valeur: IContenuValeur
  operation?: 'NOT_EQUAL' | 'EQUAL'
}

interface IContenuElementCondition {
  [id: string]: IContenuOperation | undefined
}

interface IContenuCondition {
  [id: string]: IContenuElementCondition
}

interface ITitreCondition {
  statutId?: string
  contenu: IContenuCondition
}

const demarchesDefinitions: IDemarcheDefinition[] = [
  {
    titreTypeId: 'arm',
    demarcheTypeIds: ['oct'],
    restrictions: restrictionsArmOct,
    dateDebut: '2019-10-31'
  },
  {
    titreTypeId: 'arm',
    demarcheTypeIds: ['ret'],
    restrictions: restrictionsArmRet,
    dateDebut: '2019-10-31'
  },
  {
    titreTypeId: 'arm',
    demarcheTypeIds: ['ren', 'pro'],
    restrictions: restrictionsArmRenPro,
    dateDebut: '2019-10-31'
  },
  {
    titreTypeId: 'prm',
    demarcheTypeIds: ['oct'],
    restrictions: etatsDefinitionPrmOct,
    dateDebut: '2019-10-31'
  },
  {
    titreTypeId: 'axm',
    demarcheTypeIds: ['oct'],
    restrictions: restrictionsAxmOct,
    dateDebut: '2020-08-21'
  }
]

const demarcheDefinitionFind = (titreTypeId: string, demarcheTypeId: string) =>
  demarchesDefinitions.find(
    d =>
      d.titreTypeId === titreTypeId &&
      d.demarcheTypeIds.includes(demarcheTypeId)
  )

export {
  demarchesDefinitions,
  demarcheDefinitionFind,
  ITitreCondition,
  IDemarcheDefinitionRestrictions,
  IEtapeTypeIdCondition,
  IDemarcheDefinition,
  IContenuElementCondition
}
