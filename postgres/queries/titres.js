const Titres = require('../models/titres')
const options = require('./_options')

const titreGet = async id =>
  Titres.query()
    .findById(id)
    .eager(options.titres.eager)

const titresGet = async ({
  typeIds,
  domaineIds,
  statutIds,
  substances,
  noms
}) => {
  const q = Titres.query()
    .skipUndefined()
    .eager(options.titres.eager)
    .whereIn('titres.typeId', typeIds)
    .whereIn('titres.domaineId', domaineIds)
    .whereIn('titres.statutId', statutIds)

  if (noms) {
    q.whereRaw(`lower(??) ~* ${noms.map(n => '?').join('|')}`, [
      'titres.nom',
      ...noms.map(n => n.toLowerCase())
    ])
  }

  if (substances) {
    q.where(builder => {
      builder
        .whereIn(
          'demarches:etapes:substances.id',
          substances.map(n => n.toLowerCase())
        )
        .orWhereIn(
          'demarches:etapes:substances.nom',
          substances.map(n => n.toLowerCase())
        )
        .orWhereIn(
          'demarches:etapes:substances.symbole',
          substances.map(n => n.toLowerCase())
        )
        .joinRelation('demarches.etapes.substances')
    })
  }

  return q
}

const titreUpdate = async ({ id, props }) =>
  Titres.query()
    .skipUndefined()
    .findById(id)
    .patch(props)

const titreAjouter = async titre =>
  Titres.query()
    .insertGraph(titre, options.titres.update)
    .first()
    .eager(options.titres.eager)

const titreSupprimer = async id =>
  Titres.query()
    .deleteById(id)
    .first()
    .eager(options.titres.eager)
    .returning('*')

const titreModifier = async titre =>
  Titres.query()
    .upsertGraph([titre], options.titres.update)
    .eager(options.titres.eager)
    .first()

module.exports = {
  titreGet,
  titresGet,
  titreUpdate,
  titreAjouter,
  titreSupprimer,
  titreModifier
}
