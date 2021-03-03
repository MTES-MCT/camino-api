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
  IEtapeType,
  IEtapeStatut,
  ITravauxType,
  IDevise,
  IUnite,
  IAdministrationType,
  IPermission,
  IGeoSysteme,
  IDocumentType,
  IReferenceType,
  ITitreType,
  ITitreTypeTitreStatut,
  ITitreTypeDemarcheType,
  ITitreTypeDemarcheTypeEtapeType,
  IEtapeTypeEtapeStatut,
  ITravauxTypeEtapeType
} from '../../types'

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
import { fieldsFormat } from './graph/fields-format'

import { userGet } from './utilisateurs'

import {
  domainesPermissionQueryBuild,
  etapesTypesPermissionQueryBuild,
  demarchesTypesPermissionQueryBuild,
  permissionsPermissionQueryBuild,
  travauxTypesPermissionQueryBuild,
  travauxEtapesTypesPermissionQueryBuild
} from './permissions/metas'
import PhasesStatuts from '../models/phases-statuts'
import TitresTypes from '../models/titres-types'
import TitresTypesTitresStatuts from '../models/titres-types--titres-statuts'
import TitresTypesDemarchesTypesEtapesTypes from '../models/titres-types--demarches-types-etapes-types'
import TitresTypesDemarchesTypes from '../models/titres-types--demarches-types'
import EtapesTypesEtapesStatuts from '../models/etapes-types--etapes-statuts'
import TravauxTypesEtapesTypes from '../models/travaux-types--etapes-types'

const permissionsGet = async (_a: never, _b: never, userId?: string) => {
  const user = await userGet(userId)

  const q = Permissions.query().skipUndefined().orderBy('ordre')

  permissionsPermissionQueryBuild(q, user)

  return q
}

const permissionUpdate = async (id: string, props: Partial<IPermission>) =>
  Permissions.query().patchAndFetchById(id, props)

const geoSystemeUpdate = async (id: string, props: Partial<IGeoSysteme>) =>
  GeoSystemes.query().patchAndFetchById(id, props)

const documentTypeUpdate = async (id: string, props: Partial<IDocumentType>) =>
  DocumentsTypes.query().patchAndFetchById(id, props)

const referenceTypeUpdate = async (
  id: string,
  props: Partial<IReferenceType>
) => ReferencesTypes.query().patchAndFetchById(id, props)

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
    ? graphBuild(fields, 'titre', fieldsFormat)
    : options.domaines.graph

  const q = Domaines.query().withGraphFetched(graph).orderBy('ordre')

  domainesPermissionQueryBuild(q, user)

  return q
}

const domaineUpdate = async (id: string, props: Partial<IDomaine>) =>
  Domaines.query().patchAndFetchById(id, props)

const titresTypesGet = async (_: never, { fields }: { fields?: IFields }) => {
  const graph = fields
    ? graphBuild(fields, 'titresTypes', fieldsFormat)
    : options.titresTypes.graph

  return TitresTypes.query().withGraphFetched(graph).orderBy('id')
}

const titreTypeGet = async (id: string) => TitresTypes.query().findById(id)

const titreTypeUpdate = async (id: string, props: Partial<ITitreType>) =>
  TitresTypes.query().patchAndFetchById(id, props)

const titreTypeCreate = async (titreType: ITitreType) =>
  TitresTypes.query().insertAndFetch(titreType)

const titreTypeDelete = async (id: string) => TitresTypes.query().deleteById(id)

const titresTypesTitresStatutsGet = async () =>
  TitresTypesTitresStatuts.query().orderBy(['titreTypeId', 'titreStatutId'])

const titreTypeTitreStatutUpdate = async (
  titreTypeId: string,
  titreStatutId: string,
  props: Partial<ITitreTypeTitreStatut>
) =>
  TitresTypesTitresStatuts.query().patchAndFetchById(
    [titreTypeId, titreStatutId],
    props
  )

const titreTypeTitreStatutCreate = async (
  titreTypeTitreStatut: ITitreTypeTitreStatut
) => TitresTypesTitresStatuts.query().insertAndFetch(titreTypeTitreStatut)

const titreTypeTitreStatutDelete = async (
  titreTypeId: string,
  titreStatutId: string
) => TitresTypesTitresStatuts.query().deleteById([titreTypeId, titreStatutId])

const titresTypesDemarchesTypesGet = async () =>
  TitresTypesDemarchesTypes.query().orderBy(['titreTypeId', 'demarcheTypeId'])

const titreTypeDemarcheTypeUpdate = async (
  titreTypeId: string,
  demarcheTypeId: string,
  props: Partial<ITitreTypeDemarcheType>
) =>
  TitresTypesDemarchesTypes.query().patchAndFetchById(
    [titreTypeId, demarcheTypeId],
    props
  )

const titreTypeDemarcheTypeCreate = async (
  titreTypeDemarcheType: ITitreTypeDemarcheType
) => TitresTypesDemarchesTypes.query().insertAndFetch(titreTypeDemarcheType)

const titreTypeDemarcheTypeDelete = async (
  titreTypeId: string,
  demarcheTypeId: string
) => TitresTypesDemarchesTypes.query().deleteById([titreTypeId, demarcheTypeId])

const titresTypesDemarchesTypesEtapesTypesGet = async () =>
  TitresTypesDemarchesTypesEtapesTypes.query().orderBy([
    'titreTypeId',
    'demarcheTypeId',
    'etapeTypeId'
  ])

const titreTypeDemarcheTypeEtapeTypeUpdate = async (
  titreTypeId: string,
  demarcheTypeId: string,
  etapeTypeId: string,
  props: Partial<ITitreTypeDemarcheTypeEtapeType>
) =>
  TitresTypesDemarchesTypesEtapesTypes.query().patchAndFetchById(
    [titreTypeId, demarcheTypeId, etapeTypeId],
    props
  )

const titreTypeDemarcheTypeEtapeTypeCreate = async (
  titreTypeDemarcheTypeEtapeType: ITitreTypeDemarcheTypeEtapeType
) =>
  TitresTypesDemarchesTypesEtapesTypes.query().insertAndFetch(
    titreTypeDemarcheTypeEtapeType
  )

const titreTypeDemarcheTypeEtapeTypeDelete = async (
  titreTypeId: string,
  demarcheTypeId: string,
  etapeTypeId: string
) =>
  TitresTypesDemarchesTypesEtapesTypes.query().deleteById([
    titreTypeId,
    demarcheTypeId,
    etapeTypeId
  ])

const etapesTypesEtapesStatutsGet = async () =>
  EtapesTypesEtapesStatuts.query().orderBy(['etapeTypeId', 'etapeStatutId'])

const etapeTypeEtapeStatutUpdate = async (
  etapeTypeId: string,
  etapeStatutId: string,
  props: Partial<IEtapeTypeEtapeStatut>
) =>
  EtapesTypesEtapesStatuts.query().patchAndFetchById(
    [etapeTypeId, etapeStatutId],
    props
  )

const etapeTypeEtapeStatutCreate = async (
  etapeTypeEtapeStatut: IEtapeTypeEtapeStatut
) => EtapesTypesEtapesStatuts.query().insertAndFetch(etapeTypeEtapeStatut)

const etapeTypeEtapeStatutDelete = async (
  etapeTypeId: string,
  etapeStatutId: string
) => EtapesTypesEtapesStatuts.query().deleteById([etapeTypeId, etapeStatutId])

const travauxTypesEtapesTypesGet = async () =>
  TravauxTypesEtapesTypes.query().orderBy(['travauxTypeId', 'etapeTypeId'])

const travauxTypeEtapeTypeUpdate = async (
  travauxTypeId: string,
  etapeTypeId: string,
  props: Partial<ITravauxTypeEtapeType>
) =>
  TravauxTypesEtapesTypes.query().patchAndFetchById(
    [travauxTypeId, etapeTypeId],
    props
  )

const travauxTypeEtapeTypeCreate = async (
  travauxTypeEtapeType: ITravauxTypeEtapeType
) => TravauxTypesEtapesTypes.query().insertAndFetch(travauxTypeEtapeType)

const travauxTypeEtapeTypeDelete = async (
  travauxTypeId: string,
  etapeTypeId: string
) => TravauxTypesEtapesTypes.query().deleteById([travauxTypeId, etapeTypeId])

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
      TitresTypesTitresStatuts.query()
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
    ? graphBuild(fields, 'travauxTypes', fieldsFormat)
    : options.demarchesTypes.graph

  const q = TravauxTypes.query().withGraphFetched(graph).orderBy('ordre')

  travauxTypesPermissionQueryBuild(q, user, {
    titreId,
    titreTravauxId
  })

  return q
}

const travauxTypeUpdate = async (id: string, props: Partial<ITravauxType>) =>
  TravauxTypes.query().patchAndFetchById(id, props)

const demarchesTypesGet = async (
  { titreId, titreDemarcheId }: { titreId?: string; titreDemarcheId?: string },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const graph = fields
    ? graphBuild(fields, 'demarchesTypes', fieldsFormat)
    : options.demarchesTypes.graph

  const q = DemarchesTypes.query().withGraphFetched(graph).orderBy('ordre')

  demarchesTypesPermissionQueryBuild(q, user, { titreId, titreDemarcheId })

  return q
}

const demarcheTypeUpdate = async (id: string, props: Partial<IDemarcheType>) =>
  DemarchesTypes.query().patchAndFetchById(id, props)

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
    titreTravauxEtapeId,
    uniqueCheck
  }: {
    titreDemarcheId?: string
    titreEtapeId?: string
    titreTravauxId?: string
    titreTravauxEtapeId?: string
    uniqueCheck?: boolean
  } = { uniqueCheck: true },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const graph = fields
    ? graphBuild(fields, 'etapesTypes', fieldsFormat)
    : options.etapesTypes.graph

  const q = EtapesTypes.query().withGraphFetched(graph).orderBy('ordre')

  if (titreDemarcheId) {
    etapesTypesPermissionQueryBuild(q, user, {
      titreDemarcheId,
      titreEtapeId,
      uniqueCheck
    })
  }

  if (titreTravauxId) {
    travauxEtapesTypesPermissionQueryBuild(q, user, {
      titreTravauxId,
      titreTravauxEtapeId
    })
  }

  return q
}

const etapeTypeGet = async (id: string) => EtapesTypes.query().findById(id)

const etapeTypeUpdate = async (id: string, props: Partial<IEtapeType>) =>
  EtapesTypes.query().patchAndFetchById(id, props)

const devisesGet = async () => Devises.query().orderBy('id')

const deviseUpdate = async (id: string, props: Partial<IDevise>) =>
  Devises.query().patchAndFetchById(id, props)

const documentsTypesGet = async ({
  repertoire,
  typeId
}: {
  repertoire?: IDocumentRepertoire
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

const unitesGet = async () => Unites.query().orderBy('id')

const uniteUpdate = async (id: string, props: Partial<IUnite>) =>
  Unites.query().patchAndFetchById(id, props)

const activitesStatutsGet = async () => {
  const q = ActivitesStatuts.query()

  return q
}

const referencesTypesGet = async () => ReferencesTypes.query().orderBy('nom')

const etapesStatutsGet = async () => EtapesStatuts.query().orderBy('ordre')

const etapeStatutUpdate = async (id: string, props: Partial<IEtapeStatut>) =>
  EtapesStatuts.query().patchAndFetchById(id, props).orderBy('ordre')

const substancesLegalesCodesGet = async () =>
  SubstancesLegalesCodes.query().orderBy('ordre')

const definitionsGet = async () => Definitions.query().orderBy('ordre')

const definitionUpdate = async (id: string, props: Partial<IDefinition>) =>
  Definitions.query().patchAndFetchById(id, props)

const administrationsTypesGet = async () =>
  AdministrationsTypes.query().orderBy('ordre')

const administrationTypeUpdate = async (
  id: string,
  props: Partial<IAdministrationType>
) => AdministrationsTypes.query().patchAndFetchById(id, props)

export {
  domainesGet,
  domaineUpdate,
  titresTypesTypesGet,
  titreTypeTypeUpdate,
  titresTypesGet,
  titresStatutsGet,
  titreStatutUpdate,
  demarchesTypesGet,
  demarcheTypeUpdate,
  travauxTypesGet,
  travauxTypeUpdate,
  demarchesStatutsGet,
  demarcheStatutUpdate,
  etapesTypesGet,
  etapeTypeGet,
  etapeTypeUpdate,
  devisesGet,
  deviseUpdate,
  documentsTypesGet,
  documentTypeGet,
  geoSystemesGet,
  geoSystemeGet,
  unitesGet,
  uniteUpdate,
  activitesStatutsGet,
  referencesTypesGet,
  phasesStatutsGet,
  phaseStatutUpdate,
  permissionsGet,
  permissionGet,
  etapesStatutsGet,
  etapeStatutUpdate,
  substancesLegalesCodesGet,
  definitionsGet,
  definitionUpdate,
  administrationsTypesGet,
  administrationTypeUpdate,
  permissionUpdate,
  geoSystemeUpdate,
  documentTypeUpdate,
  referenceTypeUpdate,
  titreTypeGet,
  titreTypeUpdate,
  titreTypeCreate,
  titreTypeDelete,
  titresTypesTitresStatutsGet,
  titreTypeTitreStatutUpdate,
  titreTypeTitreStatutCreate,
  titreTypeTitreStatutDelete,
  titresTypesDemarchesTypesGet,
  titreTypeDemarcheTypeUpdate,
  titreTypeDemarcheTypeCreate,
  titreTypeDemarcheTypeDelete,
  titresTypesDemarchesTypesEtapesTypesGet,
  titreTypeDemarcheTypeEtapeTypeUpdate,
  titreTypeDemarcheTypeEtapeTypeCreate,
  titreTypeDemarcheTypeEtapeTypeDelete,
  etapesTypesEtapesStatutsGet,
  etapeTypeEtapeStatutUpdate,
  etapeTypeEtapeStatutCreate,
  etapeTypeEtapeStatutDelete,
  travauxTypesEtapesTypesGet,
  travauxTypeEtapeTypeUpdate,
  travauxTypeEtapeTypeCreate,
  travauxTypeEtapeTypeDelete
}
