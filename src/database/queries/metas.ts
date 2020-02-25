import ActivitesTypes from '../models/activites-types'
import DemarchesTypes from '../models/demarches-types'
import Devises from '../models/devises'
import DocumentsTypes from '../models/documents-types'
import DemarchesStatuts from '../models/demarches-statuts'
import Domaines from '../models/domaines'
import EtapesTypes from '../models/etapes-types'
import GeoSystemes from '../models/geo-systemes'
import Permissions from '../models/permissions'
import ReferencesTypes from '../models/references-types'
import TitresStatuts from '../models/titres-statuts'
import TitresTypes from '../models/titres-types'
import TitresTypesTypes from '../models/titres-types-types'
import unites from '../models/unites'
import options from './_options'

const permissionsGet = async ({ ordreMax }: { ordreMax: number }) =>
  Permissions.query()
    .skipUndefined()
    .where('ordre', '>=', ordreMax)
    .orderBy('ordre')

const permissionGet = async (id: string) => Permissions.query().findById(id)

const titresTypesGet = async ({ graph = options.titresTypes.graph } = {}) =>
  TitresTypes.query().withGraphFetched(graph)

const titresTypesTypesGet = async () => TitresTypesTypes.query()

const domainesGet = async () =>
  Domaines.query()
    .withGraphFetched(options.domaines.graph)
    .orderBy('ordre')

const titresStatutsGet = async () => TitresStatuts.query().orderBy('ordre')

const demarchesTypesGet = async () =>
  DemarchesTypes.query()
    .withGraphFetched(options.demarchesTypes.graph)
    .orderBy('ordre')

const demarchesStatutsGet = async () =>
  DemarchesStatuts.query().orderBy('ordre')

const etapesTypesGet = async () => EtapesTypes.query().orderBy('nom')

const devisesGet = async () => Devises.query().orderBy('nom')

const documentsTypesGet = async () => DocumentsTypes.query().orderBy('nom')

const geoSystemesGet = async () =>
  GeoSystemes.query()
    .withGraphFetched(options.geoSystemes.graph)
    .orderBy('ordre')

const geoSystemeGet = async (id: string) =>
  GeoSystemes.query()
    .findById(id)
    .withGraphFetched(options.geoSystemes.graph)

const unitesGet = async () => unites.query()

const activitesTypesGet = async () =>
  ActivitesTypes.query().withGraphFetched(options.activitesTypes.graph)

const referencesTypesGet = async () => ReferencesTypes.query().orderBy('nom')

export {
  titresTypesGet,
  titresTypesTypesGet,
  domainesGet,
  titresStatutsGet,
  demarchesTypesGet,
  demarchesStatutsGet,
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
