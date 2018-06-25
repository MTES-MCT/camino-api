exports.up = knex => {
  return knex.schema
    .createTable('domaines', table => {
      table.string('id', 1).primary()
      table.string('nom').notNullable()
    })
    .createTable('types', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
    })
    .createTable('_domaines_types', table => {
      table
        .string('domaine_id', 1)
        .references('domaines.id')
        .notNullable()
      table
        .string('type_id', 3)
        .references('types.id')
        .notNullable()
      table.boolean('archive')
      table.primary(['domaine_id', 'type_id'])
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
    .dropTable('_domaines_types')
    .dropTable('domaines')
    .dropTable('types')
    .dropTable('statuts')
    .dropTable('emprises')
}
