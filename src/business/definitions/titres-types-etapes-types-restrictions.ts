import { ITitreTypeEtapeTypeRestriction } from '../../types'

import restrictionsArmOct from './titres-types-etapes-types-restrictions/arm/oct'
import restrictionsArmRen from './titres-types-etapes-types-restrictions/arm/ren'
import restrictionsPrmOct from './titres-types-etapes-types-restrictions/prm/oct'

interface ITitreEtapesTypesRestrictions {
  typeId: string
  demarcheTypeId: string
  restrictions: ITitreTypeEtapeTypeRestriction[]
}

const titreEtapesTypesRestrictions = [
  {
    typeId: 'arm',
    demarcheTypeId: 'oct',
    restrictions: restrictionsArmOct as ITitreTypeEtapeTypeRestriction[]
  },
  {
    typeId: 'arm',
    demarcheTypeId: 'ren',
    restrictions: restrictionsArmRen as ITitreTypeEtapeTypeRestriction[]
  },
  {
    typeId: 'prm',
    demarcheTypeId: 'oct',
    restrictions: restrictionsPrmOct as ITitreTypeEtapeTypeRestriction[]
  }
] as ITitreEtapesTypesRestrictions[]

export default titreEtapesTypesRestrictions
