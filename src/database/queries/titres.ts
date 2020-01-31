import { ITitres, ITitresAdministrationsGestionnaires } from '../../types'
import { transaction, Transaction } from 'objection'
import Titres from '../models/titres'
import TitresAdministrationsGestionnaires from '../models/titres-administrations-gestionnaires'
import options from './_options'
// import * as sqlFormatter from 'sql-formatter'

const titreGet = async (id: string, { graph = options.titres.graph } = {}) =>
  Titres.query()
    .findById(id)
    .withGraphFetched(graph)

const titresGet = async (
  {
    ids,
    typeIds,
    domaineIds,
    statutIds,
    substances,
    noms,
    entreprises,
    references,
    territoires
  }: {
    ids?: string[] | null
    typeIds?: string[] | null
    domaineIds?: string[] | null
    statutIds?: string[] | null
    substances?: string[] | null
    noms?: string[] | null
    entreprises?: string[] | null
    references?: string[] | null
    territoires?: string[] | null
  } = {},
  { graph = options.titres.graph } = {}
) => {
  const q = Titres.query()
    .skipUndefined()
    .withGraphFetched(graph)

  if (ids) {
    q.whereIn('titres.id', ids)
  }

  if (typeIds) {
    q.whereIn('titres.typeId', typeIds)
  }

  if (domaineIds) {
    q.whereIn('titres.domaineId', domaineIds)
  }

  if (statutIds) {
    q.whereIn('titres.statutId', statutIds)
  }

  if (noms) {
    q.where(b => {
      b.whereRaw(`?? ~* ?`, [
        'titres.nom',
        noms.map(n => `(?=.*?(${n}))`).join('')
      ]).orWhereRaw(`?? ~* ?`, [
        'titres.id',
        noms.map(n => `(?=.*?(${n}))`).join('')
      ])
    })
  }

  if (references) {
    const fields = ['references.nom', 'references:type.nom']

    q.where(b => {
      references.forEach(s => {
        fields.forEach(f => {
          b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
        })
      })
    })
      .groupBy('titres.id')
      .havingRaw(
        `(${references
          .map(
            () =>
              'count(*) filter (where ' +
              fields.map(() => 'lower(??) like ?').join(' or ') +
              ') > 0'
          )
          .join(') or (')})`,
        references.reduce((res: string[], s) => {
          res.push(
            ...fields.reduce((r: string[], f) => {
              r.push(f, `%${s.toLowerCase()}%`)

              return r
            }, [])
          )

          return res
        }, [])
      )
      .joinRelated('references.type')
  }

  if (substances) {
    const fields = [
      'substances.nom',
      'substances.id',
      'substances:legales.nom',
      'substances:legales.id'
    ]

    q.where(b => {
      substances.forEach(s => {
        fields.forEach(f => {
          b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
        })
      })
    })
      .groupBy('titres.id')
      .havingRaw(
        `(${substances
          .map(
            () =>
              'count(*) filter (where ' +
              fields.map(() => 'lower(??) like ?').join(' or ') +
              ') > 0'
          )
          .join(') and (')})`,
        substances.reduce((res: string[], s) => {
          res.push(
            ...fields.reduce((r: string[], f) => {
              r.push(f, `%${s.toLowerCase()}%`)

              return r
            }, [])
          )

          return res
        }, [])
      )
      .joinRelated('substances.legales')
  }

  if (entreprises) {
    const fields = [
      'titulaires:etablissements.nom',
      'titulaires.nom',
      'titulaires.id',
      'amodiataires:etablissements.nom',
      'amodiataires.nom',
      'amodiataires.id'
    ]

    q.where(b => {
      entreprises.forEach(s => {
        fields.forEach(f => {
          b.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
        })
      })
    })
      .groupBy('titres.id')
      .havingRaw(
        `(${entreprises
          .map(
            () =>
              'count(*) filter (where ' +
              fields.map(() => 'lower(??) like ?').join(' or ') +
              ') > 0'
          )
          .join(') and (')})`,
        entreprises.reduce((res: string[], s) => {
          res.push(
            ...fields.reduce((r: string[], f) => {
              r.push(f, `%${s.toLowerCase()}%`)

              return r
            }, [])
          )

          return res
        }, [])
      )
      .leftJoinRelated(
        '[titulaires.etablissements, amodiataires.etablissements]'
      )
  }

  if (territoires) {
    const fieldsLike = [
      'communes:departement:region.nom',
      'communes:departement.nom',
      'communes.nom'
    ]

    const fieldsExact = [
      'communes:departement:region:pays.id',
      'communes:departement.id',
      'communes.id'
    ]

    q.where(b => {
      territoires.forEach(t => {
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
        `(${territoires
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
        territoires.reduce((res: string[], s) => {
          res.push(
            ...fieldsLike.reduce((r: string[], f) => {
              r.push(f, `%${s.toLowerCase()}%`)

              return r
            }, []),
            ...fieldsExact.reduce((r: string[], f) => {
              r.push(f, s.toLowerCase())

              return r
            }, [])
          )

          return res
        }, [])
      )
      .joinRelated('communes.departement.region.pays')
  }

  // console.log(sqlFormatter.format(q.toSql()))
  return q
}

const titreCreate = async (titre: ITitres) =>
  Titres.query()
    .insertGraphAndFetch(titre)
    .withGraphFetched(options.titres.graph)

const titreUpdate = async (id: string, props: ITitres) =>
  Titres.query()
    .patchAndFetchById(id, props)
    .withGraphFetched(options.titres.graph)

const titreDelete = async (id: string, tr: Transaction) =>
  Titres.query(tr)
    .deleteById(id)
    .withGraphFetched(options.titres.graph)
    .returning('*')

const titreUpsert = async (titre: ITitres, tr: Transaction) =>
  Titres.query(tr)
    .upsertGraph(titre, options.titres.update)
    .withGraphFetched(options.titres.graph)
    .returning('*')

const titresAdministrationsGestionnairesCreate = async (
  titresAdministrationsGestionnaires: ITitresAdministrationsGestionnaires
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

const titreIdUpdate = async (titreOldId: string, titre: ITitres) => {
  const knex = Titres.knex()

  return transaction(knex, async tr => {
    await titreDelete(titreOldId, tr)
    await titreUpsert(titre, tr)
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
