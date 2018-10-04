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
        .whereIn('substances:legales.id', substances.map(n => n.toLowerCase()))
        .orWhereRaw(`lower(??) ~* ${substances.map(n => '?').join('|')}`, [
          'substances:legales.nom',
          ...substances.map(n => n.toLowerCase())
        ])
        .orWhereRaw(`lower(??) ~* ${substances.map(n => '?').join('|')}`, [
          'substances.nom',
          ...substances.map(n => n.toLowerCase())
        ])
        .orWhereRaw(`lower(??) ~* ${substances.map(n => '?').join('|')}`, [
          'substances.symbole',
          ...substances.map(n => n.toLowerCase())
        ])
    }).joinRelation('substances.legales')

    // recherche dans l'historique des étapes
    // bug: retourne plusieurs fois le même titre
    // si la substance se trouve dans plusieurs étapes
    // -> solution (to-do): adjusting the result set of the first query for parents.
    // check out the whereExists() / relatedQuery() example here
    // http://vincit.github.io/objection.js/#relatedquery

    // q.where(builder => {
    //   builder
    //     .whereIn(
    //       'demarches:etapes:substances.id',
    //       substances.map(n => n.toLowerCase())
    //     )
    //     .orWhereIn(
    //       'demarches:etapes:substances.nom',
    //       substances.map(n => n.toLowerCase())
    //     )
    //     .orWhereIn(
    //       'demarches:etapes:substances.symbole',
    //       substances.map(n => n.toLowerCase())
    //     )
    // }).joinRelation('demarches.etapes.substances')
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
