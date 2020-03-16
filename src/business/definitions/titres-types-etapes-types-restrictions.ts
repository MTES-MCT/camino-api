import { ITitreTypeEtapeTypeRestriction } from '../../types'

import restrictionsArm from './titres-types-etapes-types-restrictions/arm'
import restrictionsPrm from './titres-types-etapes-types-restrictions/prm'

const titreEtapesTypesRestrictions = [
  {
    typeId: 'arm',
    restrictions: restrictionsArm as ITitreTypeEtapeTypeRestriction[]
  },
  {
    typeId: 'prm',
    restrictions: restrictionsPrm as ITitreTypeEtapeTypeRestriction[]
  }
]

export default titreEtapesTypesRestrictions
