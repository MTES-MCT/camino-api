import { IContenuValeur, ITitreEtape } from '../../types'

import { restrictionsArmRet } from './arm/ret'
import { restrictionsArmOct } from './arm/oct'
import { restrictionsArmRenPro } from './arm/ren-pro'
import { restrictionsAxmOct } from './axm/oct'
import { etatsDefinitionPrmOct } from './prm/oct'

interface IEtapeTypeIdCondition {
  etapeTypeId?: string
  statutId?: string
  titre?: ITitreCondition
  contextCheck?: (etapes: ITitreEtape[]) => boolean
}

interface IDemarcheDefinitionRestrictions {
  [key: string]: IDemarcheDefinitionRestrictionsProps
}

interface IDemarcheDefinitionRestrictionsProps {
  separation?: string[]
  final?: boolean
  avant?: IEtapeTypeIdCondition[][]
  apres?: IEtapeTypeIdCondition[][]
  justeApres: IEtapeTypeIdCondition[][]
}

interface IDemarcheDefinitionRestrictionsElements
  extends IDemarcheDefinitionRestrictionsProps {
  etapeTypeId?: string
}

interface IDemarcheDefinition {
  titreTypeId: string
  demarcheTypeIds: string[]
  restrictions: IDemarcheDefinitionRestrictions
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
    // https://camino.beta.gouv.fr/titres/m-ax-crique-tumuc-humac-2020
    dateDebut: '2020-09-30'
  }
]

const demarcheDefinitionFind = (
  titreTypeId: string,
  demarcheTypeId: string,
  date?: string
) =>
  demarchesDefinitions
    .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut))
    .reverse()
    .find(
      d =>
        (!date || d.dateDebut < date) &&
        d.titreTypeId === titreTypeId &&
        d.demarcheTypeIds.includes(demarcheTypeId)
    )

export {
  demarchesDefinitions,
  demarcheDefinitionFind,
  ITitreCondition,
  IDemarcheDefinitionRestrictions,
  IDemarcheDefinitionRestrictionsProps,
  IDemarcheDefinitionRestrictionsElements,
  IEtapeTypeIdCondition,
  IDemarcheDefinition,
  IContenuElementCondition
}
