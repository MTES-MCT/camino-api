import Titres from '../models/titres'
import options from './_options'

const titreGet = async id =>
  Titres.query()
    .findById(id)
    .eager(options.titres.eager)

const titresGet = async ({
  typeIds,
  domaineIds,
  statutIds,
  substances,
  noms,
  entreprises,
  references,
  territoires
}) => {
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
          .map(_ =>
            fields
              .map(_ => `count(*) filter (where lower(??) like ?) > 0`)
              .join(' or ')
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
      'titulaires.nom',
      'titulaires.id'
      // 'amodiataires.nom',
      // 'amodiataires.id'
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
          .map(_ =>
            fields
              .map(_ => `count(*) filter (where lower(??) like ?) > 0`)
              .join(' or ')
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
      .joinRelation('titulaires')
  }

  if (territoires) {
    const fieldsLike = [
      'communes:departement:region.nom',
      'communes:departement.nom',
      'communes.nom'
    ]

    const fieldsExact = ['communes:departement.id', 'communes.id']

    q.where(b => {
      territoires.forEach(t => {
        fieldsLike.forEach(f => {
          b.orWhereRaw(`lower(??) like ?`, [f, `%${t.toLowerCase()}%`])
        })

        fieldsExact.forEach(f => {
          b.orWhereRaw(`?? = ?`, [f, t])
        })
      })
    }).joinRelation('communes.departement.region')
  }

  console.log(q.toSql())
  return q
}

const titrePropsUpdate = async ({ id, props }) =>
  Titres.query()
    .skipUndefined()
    .findById(id)
    .patch(props)

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

const titreUpdate = async titre =>
  Titres.query()
    .upsertGraph([titre], options.titres.update)
    .eager(options.titres.eager)
    .first()

export {
  titreGet,
  titresGet,
  titrePropsUpdate,
  titreAdd,
  titreRemove,
  titreUpdate
}
