import { debug } from '../../config/index'

const restrictedDomaineIds = debug ? [] : ['f', 'r', 's']
const restrictedStatutIds = debug ? [] : ['dmc', 'ech', 'ind']

const titreIsPublicTest = (titreDomaineId, titreStatutId) =>
  !restrictedDomaineIds.includes(titreDomaineId) &&
  !restrictedStatutIds.includes(titreStatutId)

export { restrictedDomaineIds, restrictedStatutIds, titreIsPublicTest }
