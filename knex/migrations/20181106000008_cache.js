exports.up = knex =>
  knex.schema.createTable('caches', table => {
    table.string('id', 128).primary()
    table.jsonb('valeur')
  })

exports.down = knex => knex.schema.dropTable('cache')
