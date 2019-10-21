import Types from '../models/types'
import Domaines from '../models/domaines'
import Statuts from '../models/statuts'
import DemarchesTypes from '../models/demarches-types'
import options from './_options'
import Devises from '../models/devises'
import GeoSystemes from '../models/geo-systemes'
import unites from '../models/unites'
import ActivitesTypes from '../models/activites-types'
import DocumentsTypes from '../models/documents-types'

const typesGet = async () => Types.query()

const domainesGet = async () => Domaines.query().eager(options.domaines.eager)

const statutsGet = async () => Statuts.query()

const demarchesTypesGet = async () =>
  DemarchesTypes.query().eager(options.demarchesTypes.eager)

const devisesGet = async () => Devises.query()

const documentsTypesGet = async () => DocumentsTypes.query()

const geoSystemesGet = async () =>
  GeoSystemes.query().eager(options.geoSystemes.eager)

const unitesGet = async () => unites.query()

const activitesTypesGet = async () =>
  ActivitesTypes.query().eager(options.activitesTypes.eager)

export {
  typesGet,
  domainesGet,
  statutsGet,
  demarchesTypesGet,
  devisesGet,
  documentsTypesGet,
  geoSystemesGet,
  unitesGet,
  activitesTypesGet
}
