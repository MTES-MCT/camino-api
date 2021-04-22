import {
  transaction,
  Transaction,
  QueryBuilder,
  raw,
  RawBuilder
} from 'objection'

import {
  ITitreDemarche,
  ITitreEtapeFiltre,
  ITitreDemarcheColonneId,
  IColonne,
  IFields,
  Index,
  IUtilisateur
} from '../../types'

import options from './_options'
import { fieldsFormat } from './graph/fields-format'
import graphBuild from './graph/build'
import { fieldsTitreAdd } from './graph/fields-add'

import TitresDemarches from '../models/titres-demarches'
import { titresDemarchesQueryModify } from './permissions/titres-demarches'
import { titresFiltersQueryModify } from './_titres-filters'

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

const titresDemarchesFiltersQueryModify = (
  {
    typesIds,
    statutsIds,
    etapesInclues,
    etapesExclues,
    titresDemarchesIds,
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
    titresDemarchesIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresTypesIds?: string[] | null
    titresStatutsIds?: string[] | null
    titresNoms?: string | null
    titresEntreprises?: string | null
    titresSubstances?: string | null
    titresReferences?: string | null
    titresTerritoires?: string | null
  } = {},
  q: QueryBuilder<TitresDemarches, TitresDemarches[]>
) => {
  if (titresDemarchesIds) {
    q.whereIn('titresDemarches.id', titresDemarchesIds)
  }

  if (typesIds) {
    q.whereIn('titresDemarches.typeId', typesIds)
  }

  if (statutsIds) {
    q.whereIn('titresDemarches.statutId', statutsIds)
  }

  if (etapesInclues?.length || etapesExclues?.length) {
    q.leftJoinRelated('etapes').groupBy('titresDemarches.id')

    if (etapesInclues?.length) {
      etapesIncluesExcluesBuild(q, etapesInclues, 'etapesInclues')
    }

    if (etapesExclues?.length) {
      etapesIncluesExcluesBuild(q, etapesExclues, 'etapesExclues')
    }
  }

  titresFiltersQueryModify(
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
}

const titresDemarchesQueryBuild = (
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const graph = fields
    ? graphBuild(fieldsTitreAdd(fields), 'demarches', fieldsFormat)
    : options.titresDemarches.graph

  const q = TitresDemarches.query().skipUndefined().withGraphFetched(graph)

  titresDemarchesQueryModify(q, { fields }, user)

  return q
}

const titresDemarchesCount = async (
  {
    typesIds,
    statutsIds,
    etapesInclues,
    etapesExclues,
    titresDemarchesIds,
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
    titresDemarchesIds?: string[] | null
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
  user: IUtilisateur | null
) => {
  const q = titresDemarchesQueryBuild({ fields }, user)

  titresDemarchesFiltersQueryModify(
    {
      typesIds,
      statutsIds,
      etapesInclues,
      etapesExclues,
      titresDemarchesIds,
      titresDomainesIds,
      titresTypesIds,
      titresStatutsIds,
      titresNoms,
      titresEntreprises,
      titresSubstances,
      titresReferences,
      titresTerritoires
    },
    q
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
  statut: { id: 'titresDemarches.statutId' },
  references: {
    id: raw(`STRING_AGG(concat("titre:references"."type_id",
        "titre:references"."nom"),
        ' ; '
      )`),
    relation: 'titre.references',
    groupBy: []
  }
} as Index<IColonne<string | RawBuilder>>

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
    titresDemarchesIds,
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
    titresDemarchesIds?: string[] | null
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
  user: IUtilisateur | null
) => {
  const q = titresDemarchesQueryBuild({ fields }, user)

  titresDemarchesFiltersQueryModify(
    {
      typesIds,
      statutsIds,
      etapesInclues,
      etapesExclues,
      titresDomainesIds,
      titresDemarchesIds,
      titresTypesIds,
      titresStatutsIds,
      titresNoms,
      titresEntreprises,
      titresSubstances,
      titresReferences,
      titresTerritoires
    },
    q
  )

  if (colonne) {
    if (!titresDemarchesColonnes[colonne]) {
      throw new Error(`Colonne « ${colonne} » inconnue`)
    }

    const groupBy = titresDemarchesColonnes[colonne].groupBy as string[]

    if (titresDemarchesColonnes[colonne].relation) {
      q.leftJoinRelated(titresDemarchesColonnes[colonne].relation!)
    }
    q.orderBy(titresDemarchesColonnes[colonne].id, ordre || 'asc')
    q.groupBy('titresDemarches.id')

    if (groupBy) {
      groupBy.forEach(gb => {
        q.groupBy(gb as string)
      })
    } else {
      q.groupBy(titresDemarchesColonnes[colonne].id)
    }
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
  user: IUtilisateur | null
) => {
  const q = titresDemarchesQueryBuild({ fields }, user)

  return q.findById(titreDemarcheId)
}

/**
 * Crée une nouvelle démarche
 * @param titreDemarche - démarche à créer
 * @returns la nouvelle démarche
 */
const titreDemarcheCreate = async (titreDemarche: ITitreDemarche) =>
  TitresDemarches.query().insertAndFetch(titreDemarche)

const titreDemarcheDelete = async (id: string, trx?: Transaction) =>
  TitresDemarches.query(trx)
    .deleteById(id)
    .withGraphFetched(options.titresDemarches.graph)
    .returning('*')

const titreDemarcheUpdate = async (
  id: string,
  titreDemarche: Partial<ITitreDemarche>
) => TitresDemarches.query().patch(titreDemarche).findById(id)

const titreDemarcheUpsert = async (
  titreDemarche: ITitreDemarche,
  trx?: Transaction
) =>
  TitresDemarches.query(trx)
    .upsertGraph(titreDemarche, options.titresDemarches.update)
    .withGraphFetched(options.titresDemarches.graph)
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
