import { Transaction, QueryBuilder, raw, RawBuilder } from 'objection'

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

import TitresDemarches, { DBTitresDemarches } from '../models/titres-demarches'
import { titresDemarchesQueryModify } from './permissions/titres-demarches'
import { titresFiltersQueryModify } from './_titres-filters'
import TitresEtapes from '../models/titres-etapes'

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
    titresTerritoires,
    travaux
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
    travaux?: boolean | null
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

  if (travaux === false || travaux === true) {
    q.leftJoinRelated('type as titresDemarchesType')
    if (travaux) {
      q.where('titresDemarchesType.travaux', travaux)
    } else {
      q.whereRaw('?? is not true', ['titresDemarchesType.travaux'])
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
  user: IUtilisateur | null | undefined
) => {
  const graph = fields
    ? graphBuild(fieldsTitreAdd(fields), 'demarches', fieldsFormat)
    : options.titresDemarches.graph

  const q = TitresDemarches.query().withGraphFetched(graph)

  titresDemarchesQueryModify(q, user)

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
    titresTerritoires,
    travaux
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
    travaux?: boolean | null
  } = {},
  { fields }: { fields?: IFields },
  user: IUtilisateur | null | undefined
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
      titresTerritoires,
      travaux
    },
    q
  )

  return q.resultSize()
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
    titresTerritoires,
    travaux
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
    travaux?: boolean | null
  } = {},
  { fields }: { fields?: IFields },
  user: IUtilisateur | null | undefined
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
      titresTerritoires,
      travaux
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
  user: IUtilisateur | null | undefined
) => {
  const q = titresDemarchesQueryBuild({ fields }, user)

  return q
    .andWhere(b => {
      b.orWhere('titresDemarches.id', titreDemarcheId)
      b.orWhere('titresDemarches.slug', titreDemarcheId)
    })
    .first()
}

/**
 * Crée une nouvelle démarche
 * @param titreDemarche - démarche à créer
 * @returns la nouvelle démarche
 */
const titreDemarcheCreate = async (
  titreDemarche: Omit<ITitreDemarche, 'id'>
): Promise<ITitreDemarche> =>
  TitresDemarches.query().insertAndFetch(titreDemarche)

const titreDemarcheDelete = async (id: string, trx?: Transaction) =>
  TitresDemarches.query(trx)
    .deleteById(id)
    .withGraphFetched(options.titresDemarches.graph)
    .returning('*')

const titreDemarcheUpdate = async (
  id: string,
  titreDemarche: Partial<DBTitresDemarches>
) => TitresDemarches.query().patchAndFetchById(id, { ...titreDemarche, id })

const titreDemarcheUpsert = async (
  titreDemarche: ITitreDemarche,
  trx?: Transaction
) =>
  TitresDemarches.query(trx)
    .upsertGraph(titreDemarche, options.titresDemarches.update)
    .withGraphFetched(options.titresDemarches.graph)
    .returning('*')

export const titreDemarcheArchive = async (id: string) => {
  // archive la démarche
  await TitresDemarches.query().patch({ archive: true }).where('id', id)

  // archive les étapes de la démarche
  await TitresEtapes.query()
    .patch({ archive: true })
    .whereIn(
      'titreDemarcheId',
      TitresDemarches.query().select('id').where('id', id)
    )
}

export {
  titresDemarchesGet,
  titresDemarchesCount,
  titreDemarcheGet,
  titreDemarcheCreate,
  titreDemarcheUpdate,
  titreDemarcheUpsert,
  titreDemarcheDelete
}
