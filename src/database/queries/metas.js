import Types from '../models/types'
import Domaines from '../models/domaines'
import Statuts from '../models/statuts'
import DemarchesTypes from '../models/demarches-types'
import options from './_options'
import Devises from '../models/devises'
import GeoSystemes from '../models/geo-systemes'
import VolumeUnites from '../models/volume-unites'
import ActivitesTypes from '../models/activites-types'
import Emprises from '../models/emprises'
import TaxesTypes from '../models/taxes-types'

const typesGet = async () => Types.query()

const domainesGet = async () => Domaines.query().eager(options.domaines.eager)

const statutsGet = async () => Statuts.query()

const demarchesTypesGet = async () =>
  DemarchesTypes.query().eager(options.demarchesTypes.eager)

const devisesGet = async () => Devises.query()

const geoSystemesGet = async () => GeoSystemes.query()

const volumeUnitesGet = async () => VolumeUnites.query()

const activitesTypesGet = async () =>
  ActivitesTypes.query().eager(options.activitesTypes.eager)

const taxesTypesGet = async () =>
  TaxesTypes.query().eager(options.taxesTypes.eager)

const emprisesGet = async () => Emprises.query()

export {
  typesGet,
  domainesGet,
  statutsGet,
  demarchesTypesGet,
  devisesGet,
  geoSystemesGet,
  volumeUnitesGet,
  activitesTypesGet,
  taxesTypesGet,
  emprisesGet
}
