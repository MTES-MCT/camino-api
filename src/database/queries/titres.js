import Titres from '../models/titres'
import options from './_options'
import { titreFormat } from './_format'
// import * as sqlFormatter from 'sql-formatter'

const titreGet = async id => {
  const t = await Titres.query()
    .findById(id)
    .eager(options.titres.eager)

  return t && titreFormat(t)
}

const titresGet = async ({
  typeIds,
  domaineIds,
  statutIds,
  substances,
  noms,
  entreprises,
  references,
  territoires
} = {}) => {
  const q = Titres.query()
    .skipUndefined()
    .eager(options.titres.eager)

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
        substances.reduce(
          (res, s) => [
            ...res,
            ...fields.reduce((r, f) => [...r, f, `%${s.toLowerCase()}%`], [])
          ],
          []
        )
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
        entreprises.reduce(
          (res, s) => [
            ...res,
            ...fields.reduce((r, f) => [...r, f, `%${s.toLowerCase()}%`], [])
          ],
          []
        )
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
        territoires.reduce(
          (res, s) => [
            ...res,
            ...fieldsLike.reduce(
              (r, f) => [...r, f, `%${s.toLowerCase()}%`],
              []
            ),
            ...fieldsExact.reduce((r, f) => [...r, f, s.toLowerCase()], [])
          ],
          []
        )
      )
      .joinRelation('communes.departement.region.pays')
  }

  const titres = await q

  // console.log(sqlFormatter.format(q.toSql()))
  return titres.map(t => t && titreFormat(t))
}

const titrePropsUpdate = async ({ id, props }) => {
  const t = Titres.query()
    .skipUndefined()
    .findById(id)
    .patch(props)

  return t && titreFormat(t)
}

const titreAdd = async titre =>
  Titres.query()
    .insertGraph(titre, options.titres.update)
    .first()
    .eager(options.titres.eager)

const titreRemove = async id =>
  Titres.query()
    .deleteById(id)
    .first()
    .eager(options.titres.eager)
    .returning('*')

const titreUpdate = async titre => {
  const t = Titres.query()
    .upsertGraph([titre], options.titres.update)
    .eager(options.titres.eager)
    .first()

  return t && titreFormat(t)
}

export {
  titreGet,
  titresGet,
  titrePropsUpdate,
  titreAdd,
  titreRemove,
  titreUpdate
}
