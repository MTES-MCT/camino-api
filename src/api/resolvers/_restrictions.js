import { debug } from '../../config/index'

const restrictedDomaineIds = debug ? [] : ['f', 'r', 's']
const restrictedTypeIds = debug ? [] : ['arm']
const restrictedStatutIds = debug ? [] : ['dmc', 'ech', 'ind']

const titreIsPublicTest = ({ domaineId, typeId, statutId }) =>
  !restrictedDomaineIds.includes(domaineId) &&
  !restrictedTypeIds.includes(typeId) &&
  !restrictedStatutIds.includes(statutId)

export {
  restrictedDomaineIds,
  restrictedTypeIds,
  restrictedStatutIds,
  titreIsPublicTest
}
