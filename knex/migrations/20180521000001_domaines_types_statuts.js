exports.up = knex => {
  return knex.schema
    .createTable('domaines', table => {
      table.string('id', 1).primary()
      table.string('nom').notNullable()
      table.integer('ordre')
    })
    .createTable('types', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.integer('ordre')
    })
    .createTable('domaines__types', table => {
      table
        .string('domaineId', 1)
        .references('domaines.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('typeId', 3)
        .references('types.id')
        .notNullable()
        .onDelete('CASCADE')
      table.boolean('archive')
      table.primary(['domaineId', 'typeId'])
    })
    .createTable('statuts', table => {
      table.string('id', 3).primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
      table.integer('ordre')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('domaines__types')
    .dropTable('domaines')
    .dropTable('types')
    .dropTable('statuts')
}
