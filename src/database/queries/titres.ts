import {
  ITitre,
  ITitreAdministrationsGestionnaire,
  ITitreColonneInput,
  IColonne,
  Index,
  IFields,
  IUtilisateur
} from '../../types'
import { transaction, Transaction } from 'objection'

import Titres from '../models/titres'
import { titrePermissionQueryBuild } from './_permissions'

import { userGet } from './utilisateurs'

import graphBuild from './graph/build'
import graphFormat from './graph/format'
import { titresFieldsAdd } from './graph/fields-add'

import TitresAdministrationsGestionnaires from '../models/titres-administrations-gestionnaires'
import options from './_options'
// import * as sqlFormatter from 'sql-formatter'

const stringSplit = (string: string) =>
  (string.match(/[\w-/]+|"(?:\\"|[^"])+"/g) || []).map(e =>
    e.replace(/^"(.*)"$/, '$1')
  )

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

  q.groupBy('titres.id')

  if (ids) {
    q.whereIn('titres.id', ids)
  }

  if (typesIds) {
    q.leftJoinRelated('type').whereIn('type.typeId', typesIds)
  }

  if (domainesIds) {
    q.whereIn('titres.domaineId', domainesIds)
  }

  if (statutsIds) {
    q.whereIn('titres.statutId', statutsIds)
  }

  if (noms) {
    const nomsArray = stringSplit(noms)
    q.where(b => {
      b.whereRaw(`?? ~* ?`, [
        'titres.nom',
        nomsArray.map(n => `(?=.*?(${n}))`).join('')
      ]).orWhereRaw(`?? ~* ?`, [
        'titres.id',
        nomsArray.map(n => `(?=.*?(${n}))`).join('')
      ])
    })
  }

  if (references) {
    const referencesArray = stringSplit(references)
    const fields = ['references.nom', 'references:type.nom']

    q.joinRelated('references.type')
      .where(b => {
        referencesArray.forEach(s => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })

      .groupBy('titres.id')
      .havingRaw(
        `(${referencesArray
          .map(
            () =>
              'count(*) filter (where ' +
              fields.map(() => 'lower(??) like ?').join(' or ') +
              ') > 0'
          )
          .join(') and (')})`,
        referencesArray.flatMap(r =>
          fields.flatMap(f => [f, `%${r.toLowerCase()}%`])
        )
      )
  }

  if (substances) {
    const substancesArray = stringSplit(substances)
    const fields = [
      'substances.nom',
      'substances.id',
      'substances:legales.nom',
      'substances:legales.id'
    ]

    q.leftJoinRelated('substances.legales')
      .where(b => {
        substancesArray.forEach(s => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })

      .groupBy('titres.id')
      .havingRaw(
        `(${substancesArray
          .map(
            () =>
              'count(*) filter (where ' +
              fields.map(() => 'lower(??) like ?').join(' or ') +
              ') > 0'
          )
          .join(') and (')})`,
        substancesArray.flatMap(s =>
          fields.flatMap(f => [f, `%${s.toLowerCase()}%`])
        )
      )
  }

  if (entreprises) {
    const entreprisesArray = stringSplit(entreprises)
    const fields = [
      'titulaires:etablissements.nom',
      'titulaires.nom',
      'titulaires.id',
      'amodiataires:etablissements.nom',
      'amodiataires.nom',
      'amodiataires.id'
    ]

    q.leftJoinRelated(
      '[titulaires.etablissements, amodiataires.etablissements]'
    )
      .where(b => {
        entreprisesArray.forEach(s => {
          fields.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
          })
        })
      })
      .groupBy('titres.id')
      .havingRaw(
        `(${entreprisesArray
          .map(
            () =>
              'count(*) filter (where ' +
              fields.map(() => 'lower(??) like ?').join(' or ') +
              ') > 0'
          )
          .join(') and (')})`,
        entreprisesArray.flatMap(e =>
          fields.flatMap(f => [f, `%${e.toLowerCase()}%`])
        )
      )
  }

  if (territoires) {
    const territoiresArray = stringSplit(territoires)

    const fieldsLike = [
      'communes:departement:region.nom',
      'communes:departement.nom',
      'communes.nom'
    ]

    const fieldsExact = [
      'communes:departement:region.paysId',
      'communes.departementId',
      'communes.id'
    ]

    q.joinRelated('communes.departement.region')
      .where(b => {
        territoiresArray.forEach(t => {
          fieldsLike.forEach(f => {
            b.orWhereRaw(`lower(??) like ?`, [f, `%${t.toLowerCase()}%`])
          })

          fieldsExact.forEach(f => {
            b.orWhereRaw(`?? = ?`, [f, t])
          })
        })
      })

      .groupBy('titres.id')
      .havingRaw(
        `(${territoiresArray
          .map(
            () =>
              'count(*) filter (where ' +
              [
                ...fieldsLike.map(() => 'lower(??) like ?'),
                ...fieldsExact.map(() => `lower(??) = ?`)
              ].join(' or ') +
              ') > 0'
          )
          .join(') and (')})`,
        territoiresArray.flatMap(t => [
          ...fieldsLike.flatMap(f => [f, `%${t.toLowerCase()}%`]),
          ...fieldsExact.flatMap(f => [f, t.toLowerCase()])
        ])
      )
  }

  return q
}

const titreGet = async (
  id: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)
  const q = titresQueryBuild({}, { fields }, user)

  return (await q.findById(id)) as ITitre
}

const titresColonnes = {
  nom: { id: 'nom' },
  domaine: { id: 'domaineId' },
  type: { id: 'type.type.nom', relation: 'type' },
  statut: { id: 'statutId' },
  substances: { id: 'substances.nom', relation: 'substances' },
  titulaires: { id: 'titulaires.nom', relation: 'titulaires' }
} as Index<IColonne>

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
    colonne?: ITitreColonneInput | null
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
