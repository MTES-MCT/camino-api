exports.seed = (knex, Promise) =>
  Promise.all([
    knex('titres_emprises').del(),
    knex('titres_points').del(),
    knex('titres_substances').del(),
    knex('titres_utilisateurs').del(),
    knex('titres_titulaires').del(),
    knex('titres_amodiataires').del()
  ])
    .then(() => knex('titres_etapes').del())
    .then(() => knex('titres_demarches').del())
    .then(() => knex('titres').del())
    .then(() =>
      Promise.all([
        knex('entreprises').del(),
        knex('administrations').del(),
        knex('substances').del()
      ])
    )
    .then(() =>
      Promise.all([
        knex('substances_legals').del(),
        knex('utilisateurs').del(),
        knex('_domaines_types').del(),
        knex('_demarches_etapes').del(),
        knex('statuts').del(),
        knex('emprises').del(),
        knex('demarches').del(),
        knex('demarches_statuts').del(),
        knex('etapes').del(),
        knex('etapes_statuts').del()
      ])
    )
    .then(() => Promise.all([knex('domaines').del(), knex('types').del()]))
