import {
  ITitreActivite,
  IFields,
  IUtilisateur,
  ITitreActiviteColonneId,
  Index,
  IColonne
} from '../../types'

import graphFormat from './graph/format'
import { fieldsTitreAdd } from './graph/fields-add'
import graphBuild from './graph/build'

import TitresActivites from '../models/titres-activites'
import options from './_options'
import {
  titreActivitePermissionQueryBuild,
  titreActiviteQueryPropsBuild
} from './permissions/titres-activites'
import { userGet } from './utilisateurs'
import { raw } from 'objection'
import { titresFiltersQueryBuild } from './_titres-filters'

import Objection = require('objection')

/**
 * Construit le corps de la requête sur les activités (hors paramètres de pagination)
 *
 * @param typesIds - tableau de type(s) d'activité
 * @param statutsIds - tableau de statut(s) d'activité
 * @param annees - année de l'activité
 * @param titresNoms - chaîne de nom(s) de titre
 * @param titresEntreprises - chaîne de nom(s) d'entreprise titulaire ou amodiataire d'un titre
 * @param titresSubstances - chaîne de substance(s) se rapportant à un titre
 * @param titresReferences - chaîne de référence(s) se rapportant à un titre
 * @param titresTerritoires - chaîne de territoire(s) se rapportant à un titre
 * @param titresTypesIds - tableau de type(s) de titre
 * @param titresDomainesIds - tableau de domaine(s)
 * @param titresStatutsIds - tableau de statut(s) de titre
 * @param fields - propriétés demandées
 * @param userId - utilisateur
 * @returns une requête d'activités
 *
 */

const titreActivitesQueryBuild = (
  {
    typesIds,
    statutsIds,
    annees,
    titresNoms,
    titresEntreprises,
    titresSubstances,
    titresReferences,
    titresTerritoires,
    titresTypesIds,
    titresDomainesIds,
    titresStatutsIds
  }: {
    typesIds?: string[] | null
    statutsIds?: string[] | null
    annees?: number[] | null
    titresNoms?: string | null
    titresEntreprises?: string | null
    titresSubstances?: string | null
    titresReferences?: string | null
    titresTerritoires?: string | null
    titresTypesIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresStatutsIds?: string[] | null
  },
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  if (!user?.permissionId) return null

  const graph = fields
    ? graphBuild(fieldsTitreAdd(fields, true), 'activite', graphFormat)
    : options.titresActivites.graph

  const q = TitresActivites.query().withGraphFetched(graph)

  titreActivitePermissionQueryBuild(q, user)
  titreActiviteQueryPropsBuild(q, user)

  q.groupBy('titresActivites.id')

  if (typesIds) {
    q.whereIn('titresActivites.typeId', typesIds)
  }

  if (annees) {
    q.whereIn('titresActivites.annee', annees)
  }

  if (statutsIds) {
    q.whereIn('titresActivites.statutId', statutsIds)
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
    'titresActivites'
  )

  return q
}

/**
 * Retourne une activité au resolver
 *
 * @param id - id de l'activité
 * @param fields - propriétés demandées
 * @param userId - utilisateur
 * @returns une activité
 *
 */

const titreActiviteGet = async (
  id: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const q = titreActivitesQueryBuild({}, { fields }, user)
  if (!q) return undefined

  return (await q.findById(id)) as ITitreActivite
}

/**
 * Retourne les années des activités au resolver
 *
 * @param userId - utilisateur
 * @returns une liste d'année(s)
 *
 */

const activitesAnneesGet = async (userId?: string) => {
  const user = await userGet(userId)

  if (!user?.permissionId) return []

  const q = TitresActivites.query()

  titreActivitePermissionQueryBuild(q, user, true)

  q.select('annee')
  q.groupBy('annee')
  q.orderBy('annee', 'desc')

  const titreActivites = await q

  return titreActivites.map(ta => ta.annee)
}

const titresActivitesColonnes = {
  titre: {
    id: 'titre.nom',
    relation: 'titre',
    groupBy: true
  },
  titreDomaine: { id: 'titre.domaineId', relation: 'titre', groupBy: true },
  titreType: {
    id: 'titre:type:type.nom',
    relation: 'titre.type.type',
    groupBy: true
  },
  titreStatut: { id: 'titre.statutId', relation: 'titre', groupBy: true },
  titulaires: {
    // trie par concaténation des titulaires du titre de l'activité
    id: raw(`STRING_AGG (
    "titre:titulaires"."nom",
    ';'
    order by "titre:titulaires"."nom"
  )`),
    relation: 'titre.titulaires',
    groupBy: false
  },
  annee: { id: 'annee' },
  periode: { id: 'frequencePeriodeId' },
  statut: { id: 'statutId' }
} as Index<IColonne<string | Objection.RawBuilder>>

/**
 * Retourne les activités au resolver
 *
 * @param page - numéro de page
 * @param intervalle - nombre d'éléments par page
 * @param ordre - ordre de tri
 * @param colonne - colonne de tri
 * @param typesIds - tableau de type(s) d'activité
 * @param statutsIds - tableau de statut(s) d'activité
 * @param annees - année de l'activité
 * @param titresNoms - chaîne de nom(s) de titre
 * @param titresEntreprises - chaîne de nom(s) d'entreprise titulaire ou amodiataire d'un titre
 * @param titresSubstances - chaîne de substance(s) se rapportant à un titre
 * @param titresReferences - chaîne de référence(s) se rapportant à un titre
 * @param titresTerritoires - chaîne de territoire(s) se rapportant à un titre
 * @param titresTypesIds - tableau de type(s) de titre
 * @param titresDomainesIds - tableau de domaine(s)
 * @param titresStatutsIds - tableau de statut(s) de titre
 * @param fields - propriétés demandées
 * @param userId - utilisateur
 * @returns une liste d'activités
 *
 */

const titresActivitesGet = async (
  {
    page,
    intervalle,
    ordre,
    colonne,
    typesIds,
    statutsIds,
    annees,
    titresNoms,
    titresEntreprises,
    titresSubstances,
    titresReferences,
    titresTerritoires,
    titresTypesIds,
    titresDomainesIds,
    titresStatutsIds
  }: {
    page?: number | null
    intervalle?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: ITitreActiviteColonneId | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    annees?: number[] | null
    titresNoms?: string | null
    titresEntreprises?: string | null
    titresSubstances?: string | null
    titresReferences?: string | null
    titresTerritoires?: string | null
    titresTypesIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresStatutsIds?: string[] | null
  },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const q = titreActivitesQueryBuild(
    {
      typesIds,
      statutsIds,
      annees,
      titresNoms,
      titresEntreprises,
      titresSubstances,
      titresReferences,
      titresTerritoires,
      titresTypesIds,
      titresDomainesIds,
      titresStatutsIds
    },
    { fields },
    user
  )
  if (!q) return []

  if (colonne) {
    if (titresActivitesColonnes[colonne].relation) {
      q.leftJoinRelated(titresActivitesColonnes[colonne].relation!)
      if (titresActivitesColonnes[colonne].groupBy) {
        q.groupBy(titresActivitesColonnes[colonne].id)
      }
    }
    q.orderBy(titresActivitesColonnes[colonne].id, ordre || 'asc')
  } else {
    q.orderBy('titresActivites.titreId')
  }

  if (page && intervalle) {
    q.offset((page - 1) * intervalle)
  }

  if (intervalle) {
    q.limit(intervalle)
  }

  return q
}

/**
 * Retourne un total d'activités au resolver
 *
 * @param typesIds - tableau de type(s) d'activité
 * @param statutsIds - tableau de statut(s) d'activité
 * @param annees - année de l'activité
 * @param titresNoms - chaîne de nom(s) de titre
 * @param titresEntreprises - chaîne de nom(s) d'entreprise titulaire ou amodiataire d'un titre
 * @param titresSubstances - chaîne de substance(s) se rapportant à un titre
 * @param titresReferences - chaîne de référence(s) se rapportant à un titre
 * @param titresTerritoires - chaîne de territoire(s) se rapportant à un titre
 * @param titresTypesIds - tableau de type(s) de titre
 * @param titresDomainesIds - tableau de domaine(s)
 * @param titresStatutsIds - tableau de statut(s) de titre
 * @param fields - propriétés demandées
 * @param userId - utilisateur
 * @returns un entier
 *
 */

const titresActivitesCount = async (
  {
    typesIds,
    statutsIds,
    annees,
    titresNoms,
    titresEntreprises,
    titresSubstances,
    titresReferences,
    titresTerritoires,
    titresTypesIds,
    titresDomainesIds,
    titresStatutsIds
  }: {
    typesIds?: string[] | null
    statutsIds?: string[] | null
    annees?: number[] | null
    titresNoms?: string | null
    titresEntreprises?: string | null
    titresSubstances?: string | null
    titresReferences?: string | null
    titresTerritoires?: string | null
    titresTypesIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresStatutsIds?: string[] | null
  },
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const q = titreActivitesQueryBuild(
    {
      typesIds,
      statutsIds,
      annees,
      titresNoms,
      titresEntreprises,
      titresSubstances,
      titresReferences,
      titresTerritoires,
      titresTypesIds,
      titresDomainesIds,
      titresStatutsIds
    },
    { fields },
    user
  )
  if (!q) return 0

  const titresActivites = ((await q) as unknown) as { total: number }[]

  return titresActivites.length
}

const titresActivitesUpsert = async (titreActivites: ITitreActivite[]) =>
  TitresActivites.query()
    .withGraphFetched(options.titresActivites.graph)
    .upsertGraph(titreActivites, options.titresActivites.update)

const titreActiviteUpdate = async (
  id: string,
  props: Partial<ITitreActivite>,
  { fields }: { fields?: IFields }
) => {
  const graph = fields
    ? graphBuild(fieldsTitreAdd(fields, true), 'activite', graphFormat)
    : options.titresActivites.graph

  return TitresActivites.query()
    .withGraphFetched(graph)
    .patchAndFetchById(id, props)
}

const titreActiviteDelete = async (
  id: string,
  { fields }: { fields?: IFields }
) => {
  const graph = fields
    ? graphBuild(fieldsTitreAdd(fields, true), 'activite', graphFormat)
    : options.titresActivites.graph

  return TitresActivites.query().withGraphFetched(graph).deleteById(id)
}

export {
  titreActiviteGet,
  titresActivitesCount,
  titresActivitesUpsert,
  titresActivitesGet,
  titreActiviteUpdate,
  activitesAnneesGet,
  titreActiviteDelete
}
