import {
  ITitre,
  ITitreAdministrationsGestionnaire,
  ITitreColonneId,
  IColonne,
  Index,
  IFields,
  IUtilisateur
} from '../../types'
import { transaction, Transaction } from 'objection'

import Titres from '../models/titres'
import { titrePermissionQueryBuild } from './permissions/titres'

import { userGet } from './utilisateurs'

import graphBuild from './graph/build'
import graphFormat from './graph/format'
import { titresFieldsAdd } from './graph/fields-add'

import TitresAdministrationsGestionnaires from '../models/titres-administrations-gestionnaires'
import options from './_options'
import { titresFiltersQueryBuild } from './_titres-filters'

const titresQueryBuild = (
  {
    ids,
    domainesIds,
    typesIds,
    statutsIds,
    substances,
    noms,
    entreprises,
    references,
    territoires
  }: {
    ids?: string[] | null
    domainesIds?: string[] | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    substances?: string | null
    noms?: string | null
    entreprises?: string | null
    references?: string | null
    territoires?: string | null
  } = {},
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const graph = fields
    ? graphBuild(titresFieldsAdd(fields), 'titre', graphFormat)
    : options.titres.graph

  const q = Titres.query().withGraphFetched(graph)

  titrePermissionQueryBuild(q, user)

  // pourquoi ?
  // q.groupBy('titres.id')

  if (ids) {
    q.whereIn('titres.id', ids)
  }

  titresFiltersQueryBuild(
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

  return q
}

const titreGet = async (
  id: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const q = titresQueryBuild({}, { fields }, user)

  const titre = (await q.findById(id)) as ITitre

  return titre
}

const titresColonnes = {
  nom: { id: 'nom' },
  domaine: { id: 'domaineId' },
  type: { id: 'type.type.nom', relation: 'type' },
  statut: { id: 'statutId' },
  substances: { id: 'substances.nom', relation: 'substances' },
  titulaires: { id: 'titulaires.nom', relation: 'titulaires' }
  // activitesTotal: { id: 'activitesAbsentes + activitesEnCours + activitesDeposees' }
} as Index<IColonne<string>>

const titresGet = async (
  {
    intervalle,
    page,
    ordre,
    colonne,
    ids,
    domainesIds,
    typesIds,
    statutsIds,
    substances,
    noms,
    entreprises,
    references,
    territoires
  }: {
    intervalle?: number | null
    page?: number | null
    ordre?: 'asc' | 'desc' | null
    colonne?: ITitreColonneId | null
    ids?: string[] | null
    domainesIds?: string[] | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    substances?: string | null
    noms?: string | null
    entreprises?: string | null
    references?: string | null
    territoires?: string | null
  } = {},
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined
  const q = titresQueryBuild(
    {
      ids,
      domainesIds,
      typesIds,
      statutsIds,
      substances,
      noms,
      entreprises,
      references,
      territoires
    },
    { fields },
    user
  )

  // TODO: ajouter le sort des activités en SQL
  // if (colonne === 'activitesTotal') {
  //   activitesSortParams = { intervalle, page, ordre }
  // }

  if (colonne) {
    if (titresColonnes[colonne].relation) {
      q.leftJoinRelated(titresColonnes[colonne].relation!)
    }
    q.orderBy(titresColonnes[colonne].id, ordre || undefined)
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

const titreCreate = async (titre: ITitre) =>
  Titres.query()
    .insertGraphAndFetch(titre)
    .withGraphFetched(options.titres.graph)

const titreUpdate = async (id: string, props: Partial<ITitre>) =>
  Titres.query()
    .patchAndFetchById(id, props)
    .withGraphFetched(options.titres.graph)

const titreDelete = async (id: string, tr?: Transaction) =>
  Titres.query(tr)
    .deleteById(id)
    .withGraphFetched(options.titres.graph)
    .returning('*')

const titreUpsert = async (titre: ITitre, tr?: Transaction) =>
  Titres.query(tr)
    .upsertGraph(titre, options.titres.update)
    .withGraphFetched(options.titres.graph)
    .returning('*')

const titresAdministrationsGestionnairesCreate = async (
  titresAdministrationsGestionnaires: ITitreAdministrationsGestionnaire[]
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

const titreIdUpdate = async (titreOldId: string, titre: ITitre) => {
  const knex = Titres.knex()

  return transaction(knex, async tr => {
    await titreDelete(titreOldId, tr)

    return titreUpsert(titre, tr)
  })
}

export {
  titreGet,
  titresGet,
  titreUpdate,
  titreCreate,
  titreDelete,
  titresAdministrationsGestionnairesCreate,
  titreAdministrationGestionnaireDelete,
  titreIdUpdate,
  titreUpsert
}
