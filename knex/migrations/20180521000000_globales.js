exports.up = knex =>
  knex.schema.createTable('globales', table => {
    table.string('id').primary()
    table.boolean('valeur').notNullable()
  })

exports.down = knex => knex.schema.dropTable('globales')
