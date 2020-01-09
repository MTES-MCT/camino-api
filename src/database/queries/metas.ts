import ActivitesTypes from '../models/activites-types'
import DemarchesTypes from '../models/demarches-types'
import Devises from '../models/devises'
import DocumentsTypes from '../models/documents-types'
import Domaines from '../models/domaines'
import EtapesTypes from '../models/etapes-types'
import GeoSystemes from '../models/geo-systemes'
import Permissions from '../models/permissions'
import ReferencesTypes from '../models/references-types'
import Statuts from '../models/statuts'
import Types from '../models/types'
import unites from '../models/unites'
import options from './_options'

interface IPermissionsOptions {
  ordreMax: number
}

const permissionsGet = async ({ ordreMax }: IPermissionsOptions) =>
  Permissions.query()
    .skipUndefined()
    .where('ordre', '>=', ordreMax)
    .orderBy('ordre')

const permissionGet = async (id: string) => Permissions.query().findById(id)

const typesGet = async ({ graph = options.types.graph } = {}) =>
  Types.query().withGraphFetched(graph)

const domainesGet = async () =>
  Domaines.query()
    .withGraphFetched(options.domaines.graph)
    .orderBy('ordre')

const statutsGet = async () => Statuts.query()

const demarchesTypesGet = async () =>
  DemarchesTypes.query()
    .withGraphFetched(options.demarchesTypes.graph)
    .orderBy('ordre')

const etapesTypesGet = async () => EtapesTypes.query().orderBy('nom')

const devisesGet = async () => Devises.query().orderBy('nom')

const documentsTypesGet = async () => DocumentsTypes.query().orderBy('nom')

const geoSystemesGet = async () =>
  GeoSystemes.query().withGraphFetched(options.geoSystemes.graph)

const geoSystemeGet = async (id: string) =>
  GeoSystemes.query()
    .findById(id)
    .withGraphFetched(options.geoSystemes.graph)

const unitesGet = async () => unites.query()

const activitesTypesGet = async () =>
  ActivitesTypes.query().withGraphFetched(options.activitesTypes.graph)

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
