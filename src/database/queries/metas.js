import Types from '../models/types'
import Domaines from '../models/domaines'
import Statuts from '../models/statuts'
import DemarchesTypes from '../models/demarches-types'
import options from './_options'

const typesGet = async () => Types.query()

const domainesGet = async () => Domaines.query()

const statutsGet = async () => Statuts.query()

const demarchesTypesGet = async () =>
  DemarchesTypes.query().eager(options.demarchesTypes.eager)

export { typesGet, domainesGet, statutsGet, demarchesTypesGet }
