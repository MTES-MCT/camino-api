import { debug } from '../../config/index'

const restrictedDomaineIds = debug ? [] : ['f', 's']
const restrictedTypeIds = debug ? [] : ['arm']
const restrictedStatutIds = debug ? [] : ['dmc', 'ech', 'ind']

export { restrictedDomaineIds, restrictedTypeIds, restrictedStatutIds }
