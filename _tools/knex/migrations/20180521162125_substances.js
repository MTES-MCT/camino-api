exports.up = knex => {
  return knex.schema
    .createTable('substancesLegalsCodes', table => {
      table.string('id').primary()
      table.string('nom').notNullable()
      table.string('description')
      table.string('lien').notNullable()
    })
    .createTable('substancesLegals', table => {
      table.string('id').primary()
      table.string('nom').notNullable()
      table
        .string('domaineId', 1)
        .notNullable()
        .references('domaines.id')
      table.string('description')
      table
        .string('substanceLegalCodeId')
        .references('substancesLegalsCodes.id')
        .notNullable()
    })
    .createTable('substances', table => {
      table.string('id', 4).primary()
      table.string('nom').notNullable()
      table.string('symbole')
      table.integer('gerep')
      table.string('description', 2048)
      table
        .string('substanceLegalId')
        .references('substancesLegals.id')
        .notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('substances')
    .dropTable('substancesLegals')
    .dropTable('substancesLegalsCodes')
}
