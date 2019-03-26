import Departements from '../models/departements'
import Communes from '../models/communes'
import _options from './_options'

const departementsGet = async () => Departements.query()

const communesGet = async () => Communes.query().eager(_options.communes.eager)

const communeInsert = async commune => Communes.query().insert(commune)

export { departementsGet, communeInsert, communesGet }
