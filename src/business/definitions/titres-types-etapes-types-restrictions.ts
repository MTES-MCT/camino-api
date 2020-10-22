import { ITitreEtapesTypesRestrictions } from '../../types'

import restrictionsArmOct from './titres-types-etapes-types-restrictions/arm/oct'
import restrictionsArmRenPro from './titres-types-etapes-types-restrictions/arm/ren-pro'
import restrictionsArmRet from './titres-types-etapes-types-restrictions/arm/ret'
import restrictionsPrmOct from './titres-types-etapes-types-restrictions/prm/oct'

const titreEtapesTypesRestrictions: ITitreEtapesTypesRestrictions[] = [
  {
    typeId: 'arm',
    demarcheTypeIds: ['oct'],
    restrictions: restrictionsArmOct
  },
  {
    typeId: 'arm',
    demarcheTypeIds: ['ren', 'pro'],
    restrictions: restrictionsArmRenPro
  },
  {
    typeId: 'arm',
    demarcheTypeIds: ['ret'],
    restrictions: restrictionsArmRet
  },
  {
    typeId: 'prm',
    demarcheTypeIds: ['oct'],
    restrictions: restrictionsPrmOct
  }
]

export default titreEtapesTypesRestrictions
