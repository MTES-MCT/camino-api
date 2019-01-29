const Titres = require('../models/titres')
const options = require('./_options')

const queries = {
  async titreGet(id) {
    return Titres.query()
      .findById(id)
      .eager(options.titres.eager)
  },

  async titresGet({
    typeIds,
    domaineIds,
    statutIds,
    substances,
    noms,
    entreprises,
    references
  }) {
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
      q.where(builder => {
        builder
          .whereRaw(`?? ~* ?`, [
            'titres.nom',
            noms.map(n => `(?=.*?(${n}))`).join('')
          ])
          .orWhereRaw(`?? ~* ?`, [
            'titres.id',
            noms.map(n => `(?=.*?(${n}))`).join('')
          ])
      })
    }

    if (references) {
      q.where(builder => {
        references.forEach(ref => {
          builder.orWhereRaw(`lower(??::text) like ?`, [
            'titres.references',
            `%${ref.toLowerCase()}%`
          ])
        })
      })
      // .groupBy('titres.id')
      // .havingRaw(
      //   `(${references
      //     .map(_ => `count(*) filter (where lower(??) like ?) > 0`)
      //     .join(') and (')})`,
      //   references.reduce(
      //     (res, ref) => [...res, `%${ref.toLowerCase()}%`],
      //     []
      //   )
      // )
    }

    // if (substances) {
    //   q.where(builder => {
    //     builder
    //       .whereRaw(`?? ~* ?`, ['substances.nom', substances.join('|')])
    //       .orWhereRaw(`?? ~* ?`, ['substances.id', substances.join('|')])
    //       .orWhereRaw(`?? ~* ?`, [
    //         'substances:legales.nom',
    //         substances.join('|')
    //       ])
    //       .orWhereRaw(`?? ~* ?`, [
    //         'substances:legales.id',
    //         substances.join('|')
    //       ])
    //   }).joinRelation('substances.legales')
    // }

    // if (substances) {
    //   q.where(builder => {
    //     builder.whereIn(
    //       'substances.nom',
    //       substances.map(s => `%${s.toLowerCase()}%`)
    //     )
    //     // .orWhereIn('substances.id', substances)
    //     // .orWhereIn('substances:legales.nom', substances)
    //     // .orWhereIn('substances:legales.id', substances)
    //   }).joinRelation('substances')
    // }

    // if (substances) {
    //   q.joinRelation('substances')

    //   q.where('titre.id', 'in', builder => {
    //     substances.forEach((s, i) => {
    //       builder.where('substances.nom', 'like', `%${s.toLowerCase()}%`)
    //       // .orWhereIn('substances.id', substances)
    //       // .orWhereIn('substances:legales.nom', substances)
    //       // .orWhereIn('substances:legales.id', substances)
    //     })
    //   })
    // }

    // if (substances) {
    //   q.where(builder => {
    //     builder.whereRaw(
    //       `lower(??) like all(array[${substances.map(() => '?').join(',')}])`,
    //       ['substances.nom', ...substances.map(s => `%${s.toLowerCase()}%`)]
    //     )
    //     // .whereIn('substances.nom', substances)
    //     // .orWhereIn('substances.id', substances)
    //     // .orWhereIn('substances:legales.nom', substances)
    //     // .orWhereIn('substances:legales.id', substances)
    //   }).joinRelation('substances')
    // }

    if (substances) {
      const fields = [
        'substances.nom',
        'substances.id',
        'substances:legales.nom',
        'substances:legales.id'
      ]

      q.where(builder => {
        substances.forEach(s => {
          fields.forEach(f => {
            builder.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
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

      q.where(builder => {
        entreprises.forEach(s => {
          fields.forEach(f => {
            builder.orWhereRaw(`lower(??) like ?`, [f, `%${s.toLowerCase()}%`])
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

    // console.log(q.toSql())
    return q
  },

  async titrePropsUpdate({ id, props }) {
    return Titres.query()
      .skipUndefined()
      .findById(id)
      .patch(props)
  },

  async titreAdd(titre) {
    return Titres.query()
      .insertGraph(titre, options.titres.update)
      .first()
      .eager(options.titres.eager)
  },

  async titreRemove(id) {
    return Titres.query()
      .deleteById(id)
      .first()
      .eager(options.titres.eager)
      .returning('*')
  },

  async titreUpdate(titre) {
    Titres.query()
      .upsertGraph([titre], options.titres.update)
      .eager(options.titres.eager)
      .first()
  }
}

module.exports = queries
