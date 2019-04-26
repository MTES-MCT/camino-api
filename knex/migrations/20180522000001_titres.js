exports.up = knex => {
  return knex.schema.createTable('titres', table => {
    table.string('id', 128).primary()
    table.string('nom').notNullable()
    table.string('typeId', 3).notNullable()
    table.string('domaineId', 1).notNullable()
    table
      .string('statutId', 3)
      .notNullable()
      .defaultTo('ind')
    table.specificType('references', 'jsonb[]')
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titres')
}
