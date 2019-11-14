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

const permissionsGet = async ({ ordreMax }) =>
  Permissions.query()
    .skipUndefined()
    .where('ordre', '>=', ordreMax)
    .orderBy('ordre')

const permissionGet = async id => Permissions.query().findById(id)

const typesGet = async ({ eager = options.types.eager } = {}) =>
  Types.query().eager(eager)

const domainesGet = async () => Domaines.query().eager(options.domaines.eager)

const statutsGet = async () => Statuts.query()

const demarchesTypesGet = async () =>
  DemarchesTypes.query().eager(options.demarchesTypes.eager)

const etapesTypesGet = async () => EtapesTypes.query()

const devisesGet = async () => Devises.query()

const documentsTypesGet = async () => DocumentsTypes.query()

const geoSystemesGet = async () =>
  GeoSystemes.query().eager(options.geoSystemes.eager)

const geoSystemeGet = async id =>
  GeoSystemes.query()
    .findById(id)
    .eager(options.geoSystemes.eager)

const unitesGet = async () => unites.query()

const activitesTypesGet = async () =>
  ActivitesTypes.query().eager(options.activitesTypes.eager)

const referencesTypesGet = async () => ReferencesTypes.query().orderBy('nom')

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
  permissionGet
}
