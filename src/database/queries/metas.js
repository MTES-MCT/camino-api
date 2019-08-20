import Types from '../models/types'
import Domaines from '../models/domaines'
import Statuts from '../models/statuts'
import EtapesTypes from '../models/etapes-types'
import DemarchesTypes from '../models/demarches-types'
import options from './_options'
import Devises from '../models/devises'
import GeoSystemes from '../models/geo-systemes'
import unites from '../models/unites'
import ActivitesTypes from '../models/activites-types'
import DocumentsTypes from '../models/documents-types'
import ReferencesTypes from '../models/references-types'
import Permissions from '../models/permissions'
import TaxesTypes from '../models/taxes-types'

const permissionsGet = async ({ ordreMax }) =>
  Permissions.query()
    .skipUndefined()
    .where('ordre', '>=', ordreMax)
    .orderBy('ordre')

const permissionGet = async id => Permissions.query().findById(id)

const typesGet = async ({ graph = options.types.graph } = {}) =>
  Types.query().withGraphFetched(graph)

const domainesGet = async () =>
  Domaines.query().withGraphFetched(options.domaines.graph)

const statutsGet = async () => Statuts.query()

const demarchesTypesGet = async () =>
  DemarchesTypes.query().withGraphFetched(options.demarchesTypes.graph)

const etapesTypesGet = async () => EtapesTypes.query()

const devisesGet = async () => Devises.query()

const documentsTypesGet = async () => DocumentsTypes.query()

const geoSystemesGet = async () =>
  GeoSystemes.query().withGraphFetched(options.geoSystemes.graph)

const geoSystemeGet = async id =>
  GeoSystemes.query()
    .findById(id)
    .withGraphFetched(options.geoSystemes.graph)

const unitesGet = async () => unites.query()

const activitesTypesGet = async () =>
  ActivitesTypes.query().withGraphFetched(options.activitesTypes.graph)

const referencesTypesGet = async () => ReferencesTypes.query().orderBy('nom')

const taxesTypesGet = async () =>
  TaxesTypes.query().graph(options.taxesTypes.graph)

export {
  typesGet,
  domainesGet,
  statutsGet,
  demarchesTypesGet,
  etapesTypesGet,
  devisesGet,
  documentsTypesGet,
  geoSystemesGet,
  geoSystemeGet,
  unitesGet,
  activitesTypesGet,
  referencesTypesGet,
  permissionsGet,
  permissionGet,
  taxesTypesGet
}
