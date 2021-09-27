import { Transaction, raw, RawBuilder } from 'objection'

import {
  ITitre,
  ITitreAdministrationGestionnaire,
  ITitreColonneId,
  IColonne,
  Index,
  IFields,
  IUtilisateur
} from '../../types'

import options from './_options'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'
import { titresFieldsAdd } from './graph/fields-add'

import Titres from '../models/titres'
import TitresAdministrationsGestionnaires from '../models/titres-administrations-gestionnaires'
import { titresQueryModify } from './permissions/titres'
import { titresFiltersQueryModify } from './_titres-filters'

/**
 * Construit la requête pour récupérer certains champs de titres filtrés
 *
 * @param fields - propriétés demandées sur le titre
 * @param user - utilisateur
 * @param demandeEnCours - charge aussi les demandes en cours
 * @returns la requête
 *
 */
const titresQueryBuild = (
  { fields }: { fields?: IFields },
  user: IUtilisateur | null,
  demandeEnCours?: boolean | null
) => {
  const graph = fields
    ? graphBuild(titresFieldsAdd(fields), 'titre', fieldsFormat)
    : options.titres.graph

  const q = Titres.query().withGraphFetched(graph)

  titresQueryModify(q, user, demandeEnCours)

  return q
}

/**
 * Retourne un titre en fonction de son id
 *
 * @param id - id du titre
 * @param fields - propriétés demandées sur le titre
 * @param userId - id de l’utilisateur
 * @returns un titre
 *
 */
const titreGet = async (
  id: string,
  { fields, fetchHeritage }: { fields?: IFields; fetchHeritage?: boolean },
  user: IUtilisateur | null
) => {
  const q = titresQueryBuild({ fields }, user)

  q.context({ fetchHeritage })

  return q
    .andWhere(b => {
      b.orWhere('titres.id', id)
      b.orWhere('titres.slug', id)
    })
    .first()
}

const titresColonnes = {
  nom: { id: 'nom', groupBy: ['titres.nom'] },
  domaine: { id: 'domaineId', groupBy: ['titres.domaineId'] },
  coordonnees: { id: 'coordonnees', groupBy: [] },
  type: { id: 'type:type.nom', relation: 'type.type' },
  statut: { id: 'statutId', groupBy: ['titres.statutId'] },
  activites: { id: 'activites', groupBy: [] },
  substances: {
    id: raw(`STRING_AGG("substances"."nom", ' ; ')`),
    relation: 'substances',
    groupBy: []
  },
  titulaires: {
    id: raw(`STRING_AGG("titulaires"."nom", ' ; ')`),
    relation: 'titulaires',
    groupBy: []
  },
  regions: {
    id: raw(`STRING_AGG(distinct("communes:departement:region"."nom"), ' ; ')`),
    relation: 'communes.departement.region',
    groupBy: []
  },
  departements: {
    id: raw(`STRING_AGG(distinct("communes:departement"."nom"), ' ; ')`),
    relation: 'communes.departement',
    groupBy: []
  },
  references: {
    id: raw(
      `STRING_AGG(concat("references"."type_id", "references"."nom"), ' ; ')`
    ),
    relation: 'references',
    groupBy: []
  }
} as Index<IColonne<string | RawBuilder>>

/**
 * Retourne des titres en fonction de filtres
 *
 * @param filters - filtres à appliquer
 * @param fields - propriétés demandées
 * @param user - utilisateur
 * @returns une liste de titres
 *
 */
const titresGet = async (
  {
    intervalle,
    page,
    colonne,
    ordre,
    perimetre,
    ids,
    domainesIds,
    typesIds,
    statutsIds,
    substances,
    noms,
    entreprises,
    references,
    territoires,
    slugs,
    demandeEnCours
  }: {
    intervalle?: number | null
    page?: number | null
    colonne?: ITitreColonneId | null
    ordre?: 'asc' | 'desc' | null
    perimetre?: number[] | null
    ids?: string[] | null
    domainesIds?: string[] | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    substances?: string | null
    noms?: string | null
    entreprises?: string | null
    references?: string | null
    territoires?: string | null
    slugs?: string[] | null
    demandeEnCours?: boolean | null
  } = {},
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const q = titresQueryBuild({ fields }, user, demandeEnCours)

  if (ids) {
    q.whereIn('titres.id', ids)
  }

  if (slugs) {
    q.whereIn('titres.slug', slugs)
  }

  titresFiltersQueryModify(
    {
      perimetre,
      domainesIds,
      typesIds,
      statutsIds,
      noms,
      entreprises,
      substances,
      references,
      territoires
    },
    q
  )

  if (colonne) {
    if (titresColonnes[colonne].relation) {
      q.leftJoinRelated(titresColonnes[colonne].relation!)
    }

    const groupBy = titresColonnes[colonne].groupBy as string[]

    q.groupBy('titres.id')

    if (groupBy) {
      groupBy.forEach(gb => {
        q.groupBy(gb)
      })
    } else {
      q.groupBy(titresColonnes[colonne].id)
    }

    // Utilise orderByRaw pour intégrer la chaîne 'nulls first/last'
    // dans le tri sur les activités
    // sinon les résultats 'null' apparaissent toujours en premier
    if (colonne === 'activites') {
      q.orderByRaw(
        `"activites_absentes" + "activites_en_construction" ${
          ordre === 'asc' ? 'asc nulls first' : 'desc nulls last'
        }`
      )
    } else if (colonne === 'coordonnees') {
      q.orderByRaw(`"coordonnees" notnull ${ordre}`)
    } else {
      q.orderBy(titresColonnes[colonne].id, ordre || 'asc')
    }
  } else {
    q.orderBy('titres.nom')
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
 * Retourne le nombre de titres filtrés
 *
 * @param filters - filtres
 * @param fields - propriétés demandées
 * @param user - utilisateur
 * @returns le nombre de titres
 *
 */
const titresCount = async (
  {
    domainesIds,
    typesIds,
    statutsIds,
    substances,
    noms,
    entreprises,
    references,
    territoires,
    demandeEnCours
  }: {
    domainesIds?: string[] | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    substances?: string | null
    noms?: string | null
    entreprises?: string | null
    references?: string | null
    territoires?: string | null
    demandeEnCours?: boolean | null
  } = {},
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  const q = titresQueryBuild({ fields }, user, demandeEnCours)

  titresFiltersQueryModify(
    {
      domainesIds,
      typesIds,
      statutsIds,
      noms,
      entreprises,
      substances,
      references,
      territoires
    },
    q
  )

  const titres = (await q) as unknown as { total: number }[]

  return titres.length
}

/**
 * Crée un nouveau titre
 *
 * @param titre - titre à créer
 * @param fields - Non utilisés
 * @param userId - id de l’utilisateur
 * @returns le nouveau titre
 *
 */
const titreCreate = async (titre: ITitre, { fields }: { fields?: IFields }) => {
  const graph = fields
    ? graphBuild(titresFieldsAdd(fields), 'titre', fieldsFormat)
    : options.titres.graph

  return Titres.query()
    .withGraphFetched(graph)
    .insertGraph(titre, options.titres.update)
}

const titreUpdate = async (id: string, titre: Partial<ITitre>) =>
  Titres.query().patchAndFetchById(id, { ...titre, id })

const titreDelete = async (id: string, tr?: Transaction) =>
  Titres.query(tr).deleteById(id)

const titreUpsert = async (
  titre: ITitre,
  { fields }: { fields?: IFields },
  tr?: Transaction
) => {
  const graph = fields
    ? graphBuild(titresFieldsAdd(fields), 'titre', fieldsFormat)
    : options.titres.graph

  const q = Titres.query(tr).withGraphFetched(graph)

  return q.upsertGraph(titre, options.titres.update)
}

const titresAdministrationsGestionnairesCreate = async (
  titresAdministrationsGestionnaires: ITitreAdministrationGestionnaire[]
) =>
  TitresAdministrationsGestionnaires.query().insert(
    titresAdministrationsGestionnaires
  )

const titreAdministrationGestionnaireDelete = async (
  titreId: string,
  administrationId: string
) =>
  TitresAdministrationsGestionnaires.query()
    .delete()
    .where('titreId', titreId)
    .andWhere('administrationId', administrationId)

export {
  titreGet,
  titresGet,
  titresCount,
  titreUpdate,
  titreCreate,
  titreDelete,
  titresAdministrationsGestionnairesCreate,
  titreAdministrationGestionnaireDelete,
  titreUpsert
}
