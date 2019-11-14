import { transaction } from 'objection'
import Titres from '../models/titres'
import TitresAdministrationsCentrales from '../models/titres-administrations-centrales'
import options from './_options'
// import * as sqlFormatter from 'sql-formatter'

const titreGet = async (id, { eager = options.titres.eager } = {}, tr) =>
  Titres.query(tr)
    .findById(id)
    .eager(eager)

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
  } = {},
  { eager = options.titres.eager } = {}
) => {
  const q = Titres.query()
    .skipUndefined()
    .eager(eager)

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
        references.reduce((res, s) => {
          res.push(
            ...fields.reduce((r, f) => {
              r.push(f, `%${s.toLowerCase()}%`)

              return r
            }, [])
          )

          return res
        }, [])
      )
      .joinRelation('references.type')
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
        substances.reduce((res, s) => {
          res.push(
            ...fields.reduce((r, f) => {
              r.push(f, `%${s.toLowerCase()}%`)

              return r
            }, [])
          )

          return res
        }, [])
      )
      .joinRelation('substances.legales')
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
        entreprises.reduce((res, s) => {
          res.push(
            ...fields.reduce((r, f) => {
              r.push(f, `%${s.toLowerCase()}%`)

              return r
            }, [])
          )

          return res
        }, [])
      )
      .leftJoinRelation(
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
        territoires.reduce((res, s) => {
          res.push(
            ...fieldsLike.reduce((r, f) => {
              r.push(f, `%${s.toLowerCase()}%`)

              return r
            }, []),
            ...fieldsExact.reduce((r, f) => {
              r.push(f, s.toLowerCase())

              return r
            }, [])
          )

          return res
        }, [])
      )
      .joinRelation('communes.departement.region.pays')
  }

  // console.log(sqlFormatter.format(q.toSql()))
  return q
}

const titreCreate = async titre =>
  Titres.query()
    .insertGraphAndFetch(titre)
    .eager(options.titres.eager)

const titreUpdate = async (id, props) =>
  Titres.query()
    .upsertGraphAndFetch(props, options.titres.update)
    .eager(options.titres.eager)

const titreDelete = async (id, tr) =>
  Titres.query(tr)
    .deleteById(id)
    .eager(options.titres.eager)
    .returning('*')

const titreUpsert = async (titre, tr) =>
  Titres.query(tr)
    .upsertGraph(titre, options.titres.update)
    .eager(options.titres.eager)
    .returning('*')

const titresAdministrationsCentralesCreate = async titresAdministrationsCentrales =>
  TitresAdministrationsCentrales.query().insert(titresAdministrationsCentrales)

const titreAdministrationCentraleDelete = async (titreId, administrationId) =>
  TitresAdministrationsCentrales.query()
    .delete()
    .where('titreId', titreId)
    .andWhere('administrationId', administrationId)

const titreIdUpdate = async (titreOldId, titreNew) => {
  const knex = Titres.knex()

  return transaction(knex, async tr => {
    if (titreOldId !== titreNew.id && (await titreGet(titreNew.id, {}, tr))) {
      throw new Error(`un titre avec l'id ${titreNew.id} existe déjà`)
    }

    await titreDelete(titreOldId, tr)
    await titreUpsert(titreNew, tr)
  })
}

export {
  titreGet,
  titresGet,
  titreUpdate,
  titreCreate,
  titreDelete,
  titresAdministrationsCentralesCreate,
  titreAdministrationCentraleDelete,
  titreIdUpdate,
  titreUpsert
}
