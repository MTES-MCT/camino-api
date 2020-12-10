import {
  IFields,
  IDocumentRepertoire,
  IDomaine,
  IDefinition,
  ITitreTypeType,
  ITitreStatut,
  IDemarcheType,
  IDemarcheStatut,
  IPhaseStatut,
  IEtapeType
} from '../../types'

import ActivitesTypes from '../models/activites-types'
import DemarchesTypes from '../models/demarches-types'
import TravauxTypes from '../models/travaux-types'
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
import Unites from '../models/unites'
import ActivitesStatuts from '../models/activites-statuts'
import EtapesStatuts from '../models/etapes-statuts'
import SubstancesLegalesCodes from '../models/substances-legales-codes'
import Definitions from '../models/definition'
import AdministrationsTypes from '../models/administrations-types'

import options from './_options'
import graphBuild from './graph/build'
import graphFormat from './graph/format'

import { userGet } from './utilisateurs'

import {
  domainesPermissionQueryBuild,
  etapesTypesPermissionQueryBuild,
  demarchesTypesPermissionQueryBuild,
  activitesTypesPermissionQueryBuild,
  permissionsPermissionQueryBuild,
  travauxTypesPermissionQueryBuild,
  travauxEtapesTypesPermissionQueryBuild
} from './permissions/metas'
import { AutorisationsTitresTypesTitresStatuts } from '../models/autorisations'
import PhasesStatuts from '../models/phases-statuts'

const permissionsGet = async (_a: never, _b: never, userId?: string) => {
  const user = await userGet(userId)

  const q = Permissions.query().skipUndefined().orderBy('ordre')

  permissionsPermissionQueryBuild(q, user)

  return q
}

const permissionGet = async (id: string) => Permissions.query().findById(id)

const titresTypesTypesGet = async () =>
  TitresTypesTypes.query().orderBy('ordre')

const titreTypeTypeUpdate = async (
  id: string,
  props: Partial<ITitreTypeType>
) => TitresTypesTypes.query().patchAndFetchById(id, props)

const domainesGet = async (
  _: never,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const graph = fields
    ? graphBuild(fields, 'titre', graphFormat)
    : options.demarchesTypes.graph

  const q = Domaines.query().withGraphFetched(graph).orderBy('ordre')

  domainesPermissionQueryBuild(q, user)

  return q
}

const domaineUpdate = async (id: string, props: Partial<IDomaine>) =>
  Domaines.query().patchAndFetchById(id, props)

/**
 * retourne les statuts de titre visible par l’utilisateur
 * @param userId - id de l’utilisateur
 * @returns liste de statuts
 */
const titresStatutsGet = async (userId?: string) => {
  let query = TitresStatuts.query().orderBy('ordre')

  // si l’utilisateur n’est pas connecté on filtre les statuts non visibles pour le public
  if (!userId) {
    query = query.whereIn(
      'id',
      AutorisationsTitresTypesTitresStatuts.query()
        .distinct('titreStatutId')
        .where('publicLecture', true)
    )
  }

  return query
}

const titreStatutUpdate = async (id: string, props: Partial<ITitreStatut>) =>
  TitresStatuts.query().patchAndFetchById(id, props)

const travauxTypesGet = async (
  { titreId, titreTravauxId }: { titreId?: string; titreTravauxId?: string },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const graph = fields
    ? graphBuild(fields, 'travauxTypes', graphFormat)
    : options.demarchesTypes.graph

  const q = TravauxTypes.query().withGraphFetched(graph).orderBy('ordre')

  travauxTypesPermissionQueryBuild(q, user, {
    titreId,
    titreTravauxId
  })

  return q
}

const demarcheTypeUpdate = async (id: string, props: Partial<IDemarcheType>) =>
  DemarchesTypes.query().patchAndFetchById(id, props)

const demarchesTypesGet = async (
  { titreId, titreDemarcheId }: { titreId?: string; titreDemarcheId?: string },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const graph = fields
    ? graphBuild(fields, 'demarchesTypes', graphFormat)
    : options.demarchesTypes.graph

  const q = DemarchesTypes.query().withGraphFetched(graph).orderBy('ordre')

  demarchesTypesPermissionQueryBuild(q, user, { titreId, titreDemarcheId })

  return q
}

const demarchesStatutsGet = async () =>
  DemarchesStatuts.query().orderBy('ordre')

const demarcheStatutUpdate = async (
  id: string,
  props: Partial<IDemarcheStatut>
) => DemarchesStatuts.query().patchAndFetchById(id, props)

const phasesStatutsGet = async () => PhasesStatuts.query().orderBy('id')

const phaseStatutUpdate = async (id: string, props: Partial<IPhaseStatut>) =>
  PhasesStatuts.query().patchAndFetchById(id, props).orderBy('id')

const etapesTypesGet = async (
  {
    titreDemarcheId,
    titreEtapeId,
    titreTravauxId,
    titreTravauxEtapeId
  }: {
    titreDemarcheId?: string
    titreEtapeId?: string
    titreTravauxId?: string
    titreTravauxEtapeId?: string
  },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const graph = fields
    ? graphBuild(fields, 'etapesTypes', graphFormat)
    : options.etapesTypes.graph

  const q = EtapesTypes.query().withGraphFetched(graph).orderBy('ordre')

  if (titreDemarcheId) {
    etapesTypesPermissionQueryBuild(q, user, { titreDemarcheId, titreEtapeId })
  }

  if (titreTravauxId) {
    travauxEtapesTypesPermissionQueryBuild(q, user, {
      titreTravauxId,
      titreTravauxEtapeId
    })
  }

  return q
}

const etapeTypeUpdate = async (id: string, props: Partial<IEtapeType>) =>
  EtapesTypes.query().patchAndFetchById(id, props).orderBy('ordre')

const devisesGet = async () => Devises.query().orderBy('nom')

const documentsTypesGet = async ({
  repertoire,
  typeId
}: {
  repertoire: IDocumentRepertoire
  typeId?: string
}) => {
  const q = DocumentsTypes.query().orderBy('nom')

  if (repertoire) {
    q.where({ repertoire })

    // restreint les types de documents à ceux liés aux activités
    if (repertoire === 'activites' && typeId) {
      q.joinRelated('activitesTypes')

      q.where('activitesTypes.id', typeId)
    }
  }

  return q
}

const documentTypeGet = async (id: string) =>
  DocumentsTypes.query().findById(id)

const geoSystemesGet = async () =>
  GeoSystemes.query()
    .withGraphFetched(options.geoSystemes.graph)
    .orderBy('ordre')

const geoSystemeGet = async (id: string) =>
  GeoSystemes.query().findById(id).withGraphFetched(options.geoSystemes.graph)

const unitesGet = async () => Unites.query()

const activitesTypesGet = async (
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const graph = fields
    ? graphBuild(fields, 'activitesTypes', graphFormat)
    : options.activitesTypes.graph

  const q = ActivitesTypes.query().withGraphFetched(graph).modify('orderAsc')

  activitesTypesPermissionQueryBuild(q, user)

  return q
}

const activitesStatutsGet = async () => {
  const q = ActivitesStatuts.query()

  return q
}

const referencesTypesGet = async () => ReferencesTypes.query().orderBy('nom')

const etapesStatutsGet = async () => EtapesStatuts.query().orderBy('ordre')

const substancesLegalesCodesGet = async () =>
  SubstancesLegalesCodes.query().orderBy('ordre')

const definitionsGet = async () => Definitions.query().orderBy('ordre')

const definitionUpdate = async (id: string, props: Partial<IDefinition>) =>
  Definitions.query().patchAndFetchById(id, props)

const administrationsTypesGet = async () =>
  AdministrationsTypes.query().orderBy('ordre')

export {
  titresTypesTypesGet,
  domainesGet,
  domaineUpdate,
  titresStatutsGet,
  titreStatutUpdate,
  titreTypeTypeUpdate,
  demarchesTypesGet,
  demarcheTypeUpdate,
  demarchesStatutsGet,
  demarcheStatutUpdate,
  etapesTypesGet,
  etapeTypeUpdate,
  travauxTypesGet,
  devisesGet,
  documentsTypesGet,
  documentTypeGet,
  geoSystemesGet,
  geoSystemeGet,
  unitesGet,
  activitesTypesGet,
  activitesStatutsGet,
  referencesTypesGet,
  phasesStatutsGet,
  phaseStatutUpdate,
  permissionsGet,
  permissionGet,
  etapesStatutsGet,
  substancesLegalesCodesGet,
  definitionsGet,
  definitionUpdate,
  administrationsTypesGet
}
