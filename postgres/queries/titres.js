const Titres = require('../models/titres')
const options = require('./_options')

const queries = {
  async titreGet(id) {
    return Titres.query()
      .findById(id)
      .eager(options.titres.eager)
  },

  async titresGet({ typeIds, domaineIds, statutIds, substances, noms }) {
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
      q.whereRaw(`?? ~* ?`, [
        'titres.nom',
        noms.map(n => `(?=.*?(${n}))`).join('')
      ])
    }

    if (substances) {
      q.where(builder => {
        builder
          .whereRaw(`?? ~* ?`, ['substances.nom', substances.join('|')])
          .orWhereRaw(`?? ~* ?`, ['substances.id', substances.join('|')])
          .orWhereRaw(`?? ~* ?`, [
            'substances:legales.nom',
            substances.join('|')
          ])
          .orWhereRaw(`?? ~* ?`, [
            'substances:legales.id',
            substances.join('|')
          ])
      }).joinRelation('substances.legales')
    }

    // console.log(substances, q.toSql())
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
