exports.up = knex => {
  return knex.schema
    .createTable('substancesLegalesCodes', table => {
      table.string('id').primary()
      table.string('nom').notNullable()
      table.string('description')
      table.string('lien').notNullable()
    })
    .createTable('substancesLegales', table => {
      table.string('id').primary()
      table.string('nom').notNullable()
      table
        .string('domaineId', 1)
        .notNullable()
        .references('domaines.id')
      table.string('description')
      table
        .string('substanceLegaleCodeId')
        .references('substancesLegalesCodes.id')
        .notNullable()
    })
    .createTable('substances', table => {
      table.string('id', 4).primary()
      table.string('nom').notNullable()
      table.string('symbole')
      table.integer('gerep')
      table.string('description', 2048)
    })
    .createTable('substances__substancesLegales', table => {
      table
        .string('substanceId')
        .references('substances.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('substanceLegaleId')
        .references('substancesLegales.id')
        .notNullable()
      table.primary(['substanceId', 'substanceLegaleId'])
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('substances__substancesLegales')
    .dropTable('substances')
    .dropTable('substancesLegales')
    .dropTable('substancesLegalesCodes')
}
