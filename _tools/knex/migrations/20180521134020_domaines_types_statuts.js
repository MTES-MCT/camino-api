exports.up = knex => {
  return knex.schema
    .createTable('domaines', table => {
      table.string('id', 1).primary()
      table.string('nom').notNullable()
      table.string('couleur')
    })
    .createTable('types', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
    })
    .createTable('domainesTypes', table => {
      table
        .string('domaineId', 1)
        .references('domaines.id')
        .notNullable()
      table
        .string('typeId', 3)
        .references('types.id')
        .notNullable()
      table.boolean('archive')
      table.primary(['domaineId', 'typeId'])
    })
    .createTable('emprises', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
    })
    .createTable('statuts', table => {
      table.string('id', 3).primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('domainesTypes')
    .dropTable('domaines')
    .dropTable('types')
    .dropTable('statuts')
    .dropTable('emprises')
}
