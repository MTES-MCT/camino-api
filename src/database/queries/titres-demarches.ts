import {
  ITitreDemarche,
  ITitreEtapeFiltre,
  ITitreDemarcheColonneId,
  IColonne,
  IFields,
  Index,
  IUtilisateur
} from '../../types'
import { transaction, Transaction, QueryBuilder } from 'objection'
import TitresDemarches from '../models/titres-demarches'
import { userGet } from './utilisateurs'
import options from './_options'
import graphFormat from './graph/format'
import graphBuild from './graph/build'
import { fieldTitreAdd } from './graph/fields-add'

import { titreDemarchePermissionQueryBuild } from './permissions/titres-demarches'
import { titresFiltersQueryBuild } from './_titres-filters'

const etapesIncluesExcluesBuild = (
  q: QueryBuilder<TitresDemarches, TitresDemarches[]>,
  etapes: ITitreEtapeFiltre[],
  mode: 'etapesInclues' | 'etapesExclues'
) => {
  const raw = etapes
    .map(({ statutId, dateDebut, dateFin }) => {
      const statutCond = statutId ? 'and etapes.statut_id = ?' : ''
      const dateDebutCond = dateDebut ? 'and etapes.date >= ?' : ''
      const dateFinCond = dateFin ? 'and etapes.date <= ?' : ''

      const condition = mode === 'etapesInclues' ? '> 0' : '= 0'

      return `count(*) filter (where etapes.type_id = ? ${statutCond} ${dateDebutCond} ${dateFinCond}) ${condition}`
    })
    .join(') and (')

  q.havingRaw(
    `(${raw})`,
    etapes.flatMap(({ typeId, statutId, dateDebut, dateFin }) => {
      const values = [typeId]

      if (statutId) {
        values.push(statutId)
      }
      if (dateDebut) {
        values.push(dateDebut)
      }
      if (dateFin) {
        values.push(dateFin)
      }

      return values
    })
  )
}

const titresDemarchesQueryBuild = (
  {
    typesIds,
    statutsIds,
    etapesInclues,
    etapesExclues,
    titresDomainesIds,
    titresTypesIds,
    titresStatutsIds,
    titresNoms,
    titresEntreprises,
    titresSubstances,
    titresReferences,
    titresTerritoires
  }: {
    typesIds?: string[] | null
    statutsIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
    titresDomainesIds?: string[] | null
    titresTypesIds?: string[] | null
    titresStatutsIds?: string[] | null
    titresNoms?: string | null
    titresEntreprises?: string | null
    titresSubstances?: string | null
    titresReferences?: string | null
    titresTerritoires?: string | null
  } = {},
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const graph = fields
    ? graphBuild(fieldTitreAdd(fields), 'demarches', graphFormat)
    : options.demarches.graph

  const q = TitresDemarches.query()
    .skipUndefined()
    .withGraphFetched(graph)

  titreDemarchePermissionQueryBuild(q, user)

  // q.groupBy('titresDemarches.id')

  if (typesIds) {
    q.whereIn('titresDemarches.typeId', typesIds)
  }

  if (statutsIds) {
    q.whereIn('titresDemarches.statutId', statutsIds)
  }

  titresFiltersQueryBuild(
    {
      domainesIds: titresDomainesIds,
      typesIds: titresTypesIds,
      statutsIds: titresStatutsIds,
      noms: titresNoms,
      entreprises: titresEntreprises,
      substances: titresSubstances,
      references: titresReferences,
      territoires: titresTerritoires
    },
    q,
    'titre',
    'titresDemarches'
  )

  if (etapesInclues?.length || etapesExclues?.length) {
    q.leftJoinRelated('etapes').groupBy('titresDemarches.id')

    if (etapesInclues?.length) {
      etapesIncluesExcluesBuild(q, etapesInclues, 'etapesInclues')
    }

    if (etapesExclues?.length) {
      etapesIncluesExcluesBuild(q, etapesExclues, 'etapesExclues')
    }
  }

  return q
}

const titresDemarchesCount = async (
  {
    typesIds,
    statutsIds,
    etapesInclues,
    etapesExclues,
    titresDomainesIds,
    titresTypesIds,
    titresStatutsIds,
    titresNoms,
    titresEntreprises,
    titresSubstances,
    titresReferences,
    titresTerritoires
  }: {
    typesIds?: string[] | null
    statutsIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
    titresDomainesIds?: string[] | null
    titresTypesIds?: string[] | null
    titresStatutsIds?: string[] | null
    titresNoms?: string | null
    titresEntreprises?: string | null
    titresSubstances?: string | null
    titresReferences?: string | null
    titresTerritoires?: string | null
  } = {},
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const q = titresDemarchesQueryBuild(
    {
      typesIds,
      statutsIds,
      etapesInclues,
      etapesExclues,
      titresDomainesIds,
      titresTypesIds,
      titresStatutsIds,
      titresNoms,
      titresEntreprises,
      titresSubstances,
      titresReferences,
      titresTerritoires
    },
    { fields },
    user
  )

  const titresDemarches = ((await q) as unknown) as { total: number }[]

  return titresDemarches.length
}

const titresDemarchesColonnes = {
  titreNom: { id: 'titre.nom', relation: 'titre' },
  titreDomaine: { id: 'titre.domaineId', relation: 'titre' },
  titreType: { id: 'titre:type:type.nom', relation: 'titre.type.type' },
  titreStatut: { id: 'titre.statutId', relation: 'titre' },
  type: { id: 'titresDemarches.typeId' },
  statut: { id: 'titresDemarches.statutId' }
} as Index<IColonne<string>>

const titresDemarchesGet = async (
  {
    intervalle,
    page,
    colonne,
    ordre,
    typesIds,
    statutsIds,
    etapesInclues,
    etapesExclues,
    titresDomainesIds,
    titresTypesIds,
    titresStatutsIds,
    titresNoms,
    titresEntreprises,
    titresSubstances,
    titresReferences,
    titresTerritoires
  }: {
    intervalle?: number | null
    page?: number | null
    colonne?: ITitreDemarcheColonneId | null
    ordre?: 'asc' | 'desc' | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
    titresDomainesIds?: string[] | null
    titresTypesIds?: string[] | null
    titresStatutsIds?: string[] | null
    titresNoms?: string | null
    titresEntreprises?: string | null
    titresSubstances?: string | null
    titresReferences?: string | null
    titresTerritoires?: string | null
  } = {},
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)
  const q = titresDemarchesQueryBuild(
    {
      typesIds,
      statutsIds,
      etapesInclues,
      etapesExclues,
      titresDomainesIds,
      titresTypesIds,
      titresStatutsIds,
      titresNoms,
      titresEntreprises,
      titresSubstances,
      titresReferences,
      titresTerritoires
    },
    { fields },
    user
  )

  if (colonne) {
    if (!titresDemarchesColonnes[colonne]) {
      throw new Error(`Colonne « ${colonne} » inconnue`)
    }

    if (titresDemarchesColonnes[colonne].relation) {
      q.leftJoinRelated(titresDemarchesColonnes[colonne].relation!)
    }
    q.orderBy(titresDemarchesColonnes[colonne].id, ordre || 'asc')
    q.groupBy(titresDemarchesColonnes[colonne].id)
    q.groupBy('titresDemarches.id')
  } else {
    q.orderBy('titresDemarches.ordre')
  }

  if (page && intervalle) {
    q.offset((page - 1) * intervalle)
  }

  if (intervalle) {
    q.limit(intervalle)
  }

  return q
}

const titreDemarcheGet = async (
  titreDemarcheId: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const q = titresDemarchesQueryBuild({}, { fields }, user)

  return (await q.findById(titreDemarcheId)) as ITitreDemarche
}

const titreDemarcheCreate = async (titreDemarche: ITitreDemarche) =>
  TitresDemarches.query()
    .insertAndFetch(titreDemarche)
    .withGraphFetched(options.demarches.graph)

const titreDemarcheDelete = async (id: string, trx?: Transaction) =>
  TitresDemarches.query(trx)
    .deleteById(id)
    .withGraphFetched(options.demarches.graph)
    .returning('*')

const titreDemarcheUpdate = async (
  id: string,
  props: Partial<ITitreDemarche>
) =>
  TitresDemarches.query()
    .withGraphFetched(options.demarches.graph)
    .patchAndFetchById(id, props)

const titreDemarcheUpsert = async (
  titreDemarche: ITitreDemarche,
  trx?: Transaction
) =>
  TitresDemarches.query(trx)
    .upsertGraph(titreDemarche, options.demarches.update)
    .withGraphFetched(options.demarches.graph)
    .returning('*')

const titreDemarchesIdsUpdate = async (
  titresDemarchesIdsOld: string[],
  titresDemarchesNew: ITitreDemarche[]
) => {
  const knex = TitresDemarches.knex()

  return transaction(knex, async tr => {
    await Promise.all(
      titresDemarchesIdsOld.map(titreDemarcheId =>
        titreDemarcheDelete(titreDemarcheId, tr)
      )
    )
    await Promise.all(
      titresDemarchesNew.map(titreDemarche =>
        titreDemarcheUpsert(titreDemarche, tr)
      )
    )
  })
}

export {
  titresDemarchesGet,
  titresDemarchesCount,
  titreDemarcheGet,
  titreDemarcheCreate,
  titreDemarcheUpdate,
  titreDemarcheUpsert,
  titreDemarcheDelete,
  titreDemarchesIdsUpdate
}
