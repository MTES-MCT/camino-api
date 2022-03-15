import { raw, RawBuilder, Transaction } from 'objection'

import {
  IColonne,
  IFields,
  Index,
  ITitre,
  ITitreAdministrationGestionnaire,
  ITitreColonneId,
  IUtilisateur
} from '../../types'

import options from './_options'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'
import { titresFieldsAdd } from './graph/fields-add'

import Titres, { DBTitre } from '../models/titres'
import TitresAdministrationsGestionnaires from '../models/titres-administrations-gestionnaires'
import { titresQueryModify } from './permissions/titres'
import { titresFiltersQueryModify } from './_titres-filters'
import TitresDemarches from '../models/titres-demarches'
import TitresEtapes from '../models/titres-etapes'

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
  user: IUtilisateur | null | undefined,
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
 * @param user - l’utilisateur
 * @returns un titre
 *
 */
const titreGet = async (
  id: string,
  { fields, fetchHeritage }: { fields?: IFields; fetchHeritage?: boolean },
  user: IUtilisateur | null | undefined
): Promise<DBTitre | undefined> => {
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
    substancesLegalesIds,
    entreprisesIds,
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
    substancesLegalesIds?: string[] | null
    entreprisesIds?: string[] | null
    substances?: string | null
    noms?: string | null
    entreprises?: string | null
    references?: string | null
    territoires?: string | null
    slugs?: string[] | null
    demandeEnCours?: boolean | null
  } = {},
  { fields }: { fields?: IFields },
  user: IUtilisateur | null | undefined
) => {
  const q = titresQueryBuild({ fields }, user, demandeEnCours)

  if (slugs) {
    q.whereIn('titres.slug', slugs)
  }

  titresFiltersQueryModify(
    {
      ids,
      perimetre,
      domainesIds,
      typesIds,
      statutsIds,
      substancesLegalesIds,
      entreprisesIds,
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
    if (noms?.length) {
      q.orderByRaw('case when titres.nom ~* ? then 0 else 1 end, titres.nom', [
        `^${noms}`
      ])
    } else {
      q.orderBy('titres.nom')
    }
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
    ids,
    domainesIds,
    typesIds,
    statutsIds,
    substances,
    substancesLegalesIds,
    entreprisesIds,
    noms,
    entreprises,
    references,
    territoires,
    demandeEnCours
  }: {
    ids?: string[] | null
    domainesIds?: string[] | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    substancesLegalesIds?: string[] | null
    entreprisesIds?: string[] | null
    substances?: string | null
    noms?: string | null
    entreprises?: string | null
    references?: string | null
    territoires?: string | null
    demandeEnCours?: boolean | null
  } = {},
  { fields }: { fields?: IFields },
  user: IUtilisateur | null | undefined
) => {
  const q = titresQueryBuild({ fields }, user, demandeEnCours)

  titresFiltersQueryModify(
    {
      ids,
      domainesIds,
      typesIds,
      statutsIds,
      substancesLegalesIds,
      entreprisesIds,
      noms,
      entreprises,
      substances,
      references,
      territoires
    },
    q
  )

  return q.resultSize()
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
const titreCreate = async (
  titre: Omit<ITitre, 'id'>,
  { fields }: { fields?: IFields }
): Promise<DBTitre> => {
  const graph = fields
    ? graphBuild(titresFieldsAdd(fields), 'titre', fieldsFormat)
    : options.titres.graph

  return Titres.query()
    .withGraphFetched(graph)
    .insertGraph(titre, options.titres.update)
}

const titreUpdate = async (id: string, titre: Partial<DBTitre>) =>
  Titres.query().patchAndFetchById(id, { ...titre, id })

export const titreArchive = async (id: string) => {
  // archive le titre
  await titreUpdate(id, { archive: true })

  // archive les démarches du titre
  await TitresDemarches.query().patch({ archive: true }).where('titreId', id)

  // archive les étapes des démarches du titre
  await TitresEtapes.query()
    .patch({ archive: true })
    .whereIn(
      'titreDemarcheId',
      TitresDemarches.query().select('id').where('titreId', id)
    )
}

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
  titresAdministrationsGestionnairesCreate,
  titreAdministrationGestionnaireDelete,
  titreUpsert
}
