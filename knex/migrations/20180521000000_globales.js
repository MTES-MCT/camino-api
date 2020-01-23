exports.up = knex => {
  return knex.schema.createTable('globales', table => {
    table.string('id').primary()
    table.boolean('valeur').notNullable()
  })
}

exports.down = knex => {
  return knex.schema.dropTable('globales')
}
