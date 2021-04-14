import {
  IAdministration,
  IAdministrationColonneId,
  IAdministrationTitreType,
  IAdministrationTitreTypeTitreStatut,
  IAdministrationTitreTypeEtapeType,
  IAdministrationActiviteType,
  IFields,
  IUtilisateur
} from '../../types'

import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'
import { stringSplit } from './_utils'
import options from './_options'

import Administrations from '../models/administrations'
import AdministrationsTitresTypes from '../models/administrations-titres-types'
import { administrationsQueryModify } from './permissions/administrations'
import AdministrationsTitresTypesTitresStatuts from '../models/administrations-titres-types-titres-statuts'
import AdministrationsTitresTypesEtapesTypes from '../models/administrations-titres-types-etapes-types'
import AdministrationsActivitesTypes from '../models/administrations-activites-types'

import { QueryBuilder } from 'objection'

const administrationsFiltersQueryModify = (
  {
    noms,
    typesIds,
    administrationsIds
  }: {
    noms?: string | null
    typesIds?: string[] | null
    administrationsIds?: string[] | null
  },
  q: QueryBuilder<Administrations, Administrations[]>
) => {
  if (administrationsIds) {
    q.whereIn('administrations.id', administrationsIds)
  }

  if (noms) {
    const nomsArray = stringSplit(noms)

    if (nomsArray) {
      const fields = ['administrations.id', 'administrations.nom']

      nomsArray.forEach(s => {
        q.where(b => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })
    }
  }

  if (typesIds) {
    q.leftJoinRelated('type')

    q.whereIn('type.id', typesIds)
  }
}

const administrationsQueryBuild = (
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const graph = fields
    ? graphBuild(fields, 'administrations', fieldsFormat)
    : options.administrations.graph

  const q = Administrations.query().withGraphFetched(graph)

  administrationsQueryModify(q, { fields }, user)

  return q
}

const administrationGet = async (
  id: string,
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const q = administrationsQueryBuild({ fields }, user)

  return q.findById(id)
}

const administrationsCount = async (
  {
    noms,
    typesIds,
    administrationsIds
  }: {
    noms?: string | null
    typesIds?: string[] | null
    administrationsIds?: string[] | null
  },
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const q = administrationsQueryBuild({ fields }, user)

  administrationsFiltersQueryModify({ noms, typesIds, administrationsIds }, q)

  if (!q) return 0

  const administrations = ((await q) as unknown) as { total: number }[]

  return administrations.length
}

const administrationsGet = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  {
    page,
    intervalle,
    ordre,
    colonne,
    noms,
    typesIds,
    administrationsIds
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: IAdministrationColonneId | null
    noms?: string | null
    typesIds?: string[] | null
    administrationsIds?: string[] | null
  },
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const q = administrationsQueryBuild({ fields }, user)

  administrationsFiltersQueryModify({ noms, typesIds, administrationsIds }, q)

  // type: { id: 'type:type.nom', relation: 'type.type' }
  if (colonne && colonne === 'type') {
    q.leftJoinRelated('type')
    q.groupBy('administrations.id')
    q.groupBy('type.nom')

    q.orderBy('type.nom', ordre || 'asc')
  } else if (colonne && colonne === 'nom') {
    q.orderBy('administrations.nom', ordre || 'asc')
  } else if (colonne && colonne === 'abreviation') {
    q.orderBy('administrations.abreviation', ordre || 'asc')
  } else {
    q.orderBy('administrations.nom')
  }

  if (page && intervalle) {
    q.offset((page - 1) * intervalle)
  }

  if (intervalle) {
    q.limit(intervalle)
  }

  return q.skipUndefined()
}

const administrationsUpsert = async (administrations: IAdministration[]) =>
  Administrations.query()
    .withGraphFetched(options.administrations.graph)
    .upsertGraph(administrations, options.administrations.update)

const administrationUpdate = async (
  id: string,
  administration: Partial<IAdministration>
) => Administrations.query().patch(administration).findById(id)

const administrationTitreTypeUpsert = async (
  administrationTitreType: IAdministrationTitreType
) =>
  AdministrationsTitresTypes.query().upsertGraph(administrationTitreType, {
    insertMissing: true
  })

const administrationTitreTypeDelete = async (
  administrationId: string,
  titreTypeId: string
) =>
  AdministrationsTitresTypes.query().deleteById([administrationId, titreTypeId])

const administrationTitreTypeTitreStatutUpsert = async (
  administrationTitreTypeTitreStatut: IAdministrationTitreTypeTitreStatut
) =>
  AdministrationsTitresTypesTitresStatuts.query().upsertGraph(
    administrationTitreTypeTitreStatut,
    { insertMissing: true }
  )

const administrationTitreTypeTitreStatutDelete = async (
  administrationId: string,
  titreTypeId: string,
  statutTypeId: string
) =>
  AdministrationsTitresTypesTitresStatuts.query().deleteById([
    administrationId,
    titreTypeId,
    statutTypeId
  ])

const administrationTitreTypeEtapeTypeUpsert = async (
  administrationTitreTypeEtapeType: IAdministrationTitreTypeEtapeType
) =>
  AdministrationsTitresTypesEtapesTypes.query().upsertGraph(
    administrationTitreTypeEtapeType,
    { insertMissing: true }
  )

const administrationTitreTypeEtapeTypeDelete = async (
  administrationId: string,
  titreTypeId: string,
  etapeTypeId: string
) =>
  AdministrationsTitresTypesEtapesTypes.query().deleteById([
    administrationId,
    titreTypeId,
    etapeTypeId
  ])

const administrationActiviteTypeUpsert = async (
  administrationActiviteType: IAdministrationActiviteType
) =>
  AdministrationsActivitesTypes.query().upsertGraph(
    administrationActiviteType,
    {
      insertMissing: true
    }
  )

const administrationActiviteTypeDelete = async (
  administrationId: string,
  ActiviteTypeId: string
) =>
  AdministrationsActivitesTypes.query().deleteById([
    administrationId,
    ActiviteTypeId
  ])

export {
  administrationGet,
  administrationsGet,
  administrationsCount,
  administrationsUpsert,
  administrationUpdate,
  administrationTitreTypeUpsert,
  administrationTitreTypeDelete,
  administrationTitreTypeTitreStatutUpsert,
  administrationTitreTypeTitreStatutDelete,
  administrationTitreTypeEtapeTypeUpsert,
  administrationTitreTypeEtapeTypeDelete,
  administrationActiviteTypeUpsert,
  administrationActiviteTypeDelete
}
