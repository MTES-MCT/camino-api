exports.up = knex =>
  knex.schema.createTable('definitions', table => {
    table.string('id', 3).primary()
    table.string('nom').notNullable()
    table.string('table')
    table.text('description')
  })

exports.down = knex => knex.schema.dropTable('definitions')
