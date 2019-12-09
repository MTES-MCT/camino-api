exports.up = knex =>
  knex.schema.alterTable('titresCommunes', table => {
    table.integer('surface')
  })

exports.down = knex =>
  knex.schema.alterTable('titresCommunes', table => {
    table.dropColumn('surface')
  })
