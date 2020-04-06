import { IFields } from '../../types'
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
import TitresTypesTypes from '../models/titres-types-types'
import unites from '../models/unites'
import options from './_options'
import { userGet } from './utilisateurs'
import {
  demarchesTypesPermissionQueryBuild,
  etapesTypesPermissionQueryBuild,
  domainesPermissionQueryBuild
} from './_permissions'
import graphBuild from './graph/build'
import graphFormat from './graph/format'

const permissionsGet = async ({ ordreMax }: { ordreMax: number }) =>
  Permissions.query()
    .skipUndefined()
    .where('ordre', '>=', ordreMax)
    .orderBy('ordre')

const permissionGet = async (id: string) => Permissions.query().findById(id)

const titresTypesTypesGet = async () => TitresTypesTypes.query()

const domainesGet = async (
  _: any,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const graph = fields
    ? graphBuild(fields, 'titre', graphFormat)
    : options.demarchesTypes.graph

  const q = Domaines.query()
    .withGraphFetched(graph)
    .orderBy('ordre')

  domainesPermissionQueryBuild(q, user)

  return q
}

const titresStatutsGet = async () => TitresStatuts.query().orderBy('ordre')

const demarchesTypesGet = async (
  { titreId, titreDemarcheId }: { titreId?: string; titreDemarcheId?: string },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const graph = fields
    ? graphBuild(fields, 'demarchesTypes', graphFormat)
    : options.demarchesTypes.graph

  const q = DemarchesTypes.query()
    .withGraphFetched(graph)
    .orderBy('ordre')

  demarchesTypesPermissionQueryBuild(q, user, { titreId, titreDemarcheId })

  return q
}

const demarchesStatutsGet = async () =>
  DemarchesStatuts.query().orderBy('ordre')

const etapesTypesGet = async (
  {
    titreDemarcheId,
    titreEtapeId
  }: { titreDemarcheId?: string; titreEtapeId?: string },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const graph = fields
    ? graphBuild(fields, 'etapesTypes', graphFormat)
    : options.etapesTypes.graph

  const q = EtapesTypes.query()
    .withGraphFetched(graph)
    .orderBy('ordre')

  etapesTypesPermissionQueryBuild(q, user, { titreDemarcheId, titreEtapeId })

  return q
}

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
