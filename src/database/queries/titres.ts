import {
  ITitre,
  ITitreAdministrationsGestionnaire,
  ITitreColonneId,
  IColonne,
  Index,
  IFields,
  IUtilisateur
} from '../../types'
import { transaction, Transaction, raw, RawBuilder } from 'objection'

import Titres from '../models/titres'
import { titrePermissionQueryBuild } from './permissions/titres'

import { userGet } from './utilisateurs'

import graphBuild from './graph/build'
import graphFormat from './graph/format'
import { titresFieldsAdd } from './graph/fields-add'

import TitresAdministrationsGestionnaires from '../models/titres-administrations-gestionnaires'
import options from './_options'
import { titresFiltersQueryBuild } from './_titres-filters'
import { permissionCheck } from '../../tools/permission'
import { AutorisationsTitresTypesAdministrations } from '../models/autorisations'

const titresQueryBuild = (
  {
    perimetre,
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
  } = {},
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const graph = fields
    ? graphBuild(titresFieldsAdd(fields), 'titre', graphFormat)
    : options.titres.graph

  const q = Titres.query().withGraphFetched(graph)

  titrePermissionQueryBuild(q, fields, user)

  if (ids) {
    q.whereIn('titres.id', ids)
  }

  titresFiltersQueryBuild(
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

const titreFromIdGet = async (
  id: string,
  element: 'etape',
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const q = titresQueryBuild({}, { fields }, user)

  if (element === 'etape') {
    q.joinRelated('demarches.etapes')
    q.where('demarches:etapes.id', id)
  }

  const titre = (await q.first()) as ITitre

  return titre
}

const titresColonnes = {
  nom: { id: 'nom', groupBy: ['titres.nom'] },
  domaine: { id: 'domaineId', groupBy: ['titres.domaineId'] },
  type: { id: 'type:type.nom', relation: 'type.type' },
  statut: { id: 'statutId', groupBy: ['titres.statutId'] },
  activites: {
    id: 'activites',
    groupBy: []
  },
  substances: {
    id: raw(`STRING_AGG(
        "substances"."nom",
        ' ; '
      )`),
    relation: 'substances',
    groupBy: []
  },
  titulaires: {
    id: raw(`STRING_AGG(
        "titulaires"."nom",
        ' ; '
      )`),
    relation: 'titulaires',
    groupBy: []
  }
} as Index<IColonne<string | RawBuilder>>

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
    territoires
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
  } = {},
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const q = titresQueryBuild(
    {
      perimetre,
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

  if (colonne) {
    if (titresColonnes[colonne].relation) {
      q.leftJoinRelated(titresColonnes[colonne].relation!)
    }

    const groupBy = titresColonnes[colonne].groupBy as string[]
    q.groupBy('titres.id')
    if (groupBy) {
      groupBy.forEach(gb => {
        q.groupBy(gb as string)
      })
    } else {
      q.groupBy(titresColonnes[colonne].id)
    }

    // Utilise orderByRaw pour intégrer la chaîne 'nulls first/last'
    // dans le tri sur les activités
    // sinon les résultats 'null' apparaissent toujours en premier quelquesoit l'ordre
    if (colonne === 'activites') {
      q.orderByRaw(
        `"activites_absentes" + "activites_en_construction" ${
          ordre === 'asc' ? 'asc nulls first' : 'desc nulls last'
        }`
      )
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

  if (perimetre) {
    // TODO: restreindre aux titre dont au moins un point
    // est inclus dans le périmètre
    // console.log(perimetre)
  }

  return q
}

const titresCount = async (
  {
    domainesIds,
    typesIds,
    statutsIds,
    substances,
    noms,
    entreprises,
    references,
    territoires
  }: {
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
  const user = await userGet(userId)

  const q = titresQueryBuild(
    {
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

  const titres = ((await q) as unknown) as { total: number }[]

  return titres.length
}

type ICount = {
  count: string
}

const titreCreate = async (
  titre: ITitre,
  { fields }: { fields?: IFields }, // eslint-disable-line @typescript-eslint/no-unused-vars
  userId?: string
) => {
  const user = await userGet(userId)
  if (!user || !permissionCheck(user?.permissionId, ['super', 'admin'])) {
    throw new Error('droits insuffisants')
  }

  if (permissionCheck(user.permissionId, ['admin'])) {
    // vérifie qu'au moins une administration est gestionnaire sur le type de titre
    const res = ((await AutorisationsTitresTypesAdministrations.query()
      .whereIn(
        'administrationId',
        user.administrations!.map(administration => administration.id)
      )
      .where('titreTypeId', titre.typeId)
      .where('gestionnaire', true)
      .count('administrationId')) as unknown) as ICount[]

    if (!res.length || res[0].count === '0') {
      throw new Error('droits insuffisants pour créer ce type de titre')
    }
  }

  return Titres.query()
    .insertGraph(titre)
    .withGraphFetched(options.titres.graph)
}

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
  titreFromIdGet,
  titresGet,
  titresCount,
  titreUpdate,
  titreCreate,
  titreDelete,
  titresAdministrationsGestionnairesCreate,
  titreAdministrationGestionnaireDelete,
  titreIdUpdate,
  titreUpsert
}
