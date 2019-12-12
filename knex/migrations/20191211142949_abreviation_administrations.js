exports.up = knex =>
  knex.schema.alterTable('administrations', table => {
    table.string('abreviation', 255)
  })

exports.down = knex =>
  knex.schema.alterTable('administrations', table => {
    table.dropColumn('abreviation')
  })
