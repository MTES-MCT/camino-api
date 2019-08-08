import { transaction } from 'objection'
import Titres from '../models/titres'
import options from './_options'
import { titreFormat } from './_format'
// import * as sqlFormatter from 'sql-formatter'

const titreGet = async (id, { eager = options.titres.eager, format } = {}) => {
  const t = await Titres.query()
    .findById(id)
    .eager(eager)

  return t && titreFormat(t, format)
}

const titresGet = async (
  {
    typeIds,
    domaineIds,
    statutIds,
    substances,
    noms,
    entreprises,
    references,
    territoires
  } = {},
  { eager = options.titres.eager, format } = {}
) => {
  const q = Titres.query()
    .skipUndefined()
    .eager(eager)

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
    q.where(b => {
      references.forEach(ref => {
        b.orWhereRaw(`lower(??::text) like ?`, [
          'titres.references',
          `%${ref.toLowerCase()}%`
        ])
      })
    })
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

  const titres = await q

  // console.log(sqlFormatter.format(q.toSql()))
  return titres.map(t => t && titreFormat(t, format))
}

const titreCreate = async titre => {
  const t = await Titres.query()
    .insertAndFetch(titre)
    .eager(options.titres.eager)

  return t && titreFormat(t)
}

const titreUpdate = async (id, props) => {
  const t = await Titres.query()
    .patchAndFetchById(id, props)
    .eager(options.titres.eager)

  return t && titreFormat(t)
}

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

const titreIdUpdate = async (titreOldId, titreNew) => {
  const knex = Titres.knex()

  const t = await transaction(knex, async tr => {
    await titreDelete(titreOldId, tr)
    await titreUpsert(titreNew, tr)
  })

  return t && titreFormat(t)
}

export {
  titreGet,
  titresGet,
  titreUpdate,
  titreCreate,
  titreDelete,
  titreIdUpdate
}
