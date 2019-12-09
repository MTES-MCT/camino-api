exports.up = knex =>
  knex.schema.alterTable('titres_communes', t => t.integer('surface'))

exports.down = knex =>
  knex.schema.alterTable('titres_communes', t => t.integer('surface').alter())
