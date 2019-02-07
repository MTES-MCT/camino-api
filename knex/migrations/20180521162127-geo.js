exports.up = knex => {
  return knex.schema
    .createTable('pays', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
    })
    .createTable('regions', table => {
      table.string('id', 2).primary()
      table.string('nom')
      table
        .string('paysId', 3)
        .notNullable()
        .references('pays.id')
      table.string('cheflieuId', 5)
      table.string('iso31662', 6)
    })
    .createTable('departements', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table
        .string('regionId', 2)
        .notNullable()
        .references('regions.id')
      table.string('cheflieuId', 5)
      table.string('iso31662', 6)
    })
    .createTable('communes', table => {
      table.string('id', 5).primary()
      table.string('nom').notNullable()
      table
        .string('departementId', 3)
        .notNullable()
        .references('departements.id')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('communes')
    .dropTable('departements')
    .dropTable('regions')
    .dropTable('pays')
}
