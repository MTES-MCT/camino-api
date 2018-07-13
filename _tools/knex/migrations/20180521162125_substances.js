exports.up = knex => {
  return knex.schema
    .createTable('substancesLegals', table => {
      table.string('id').primary()
      table.string('nom').notNullable()
      table.string('description').notNullable()
      table.string('lien').notNullable()
    })
    .createTable('substances', table => {
      table.string('id', 4).primary()
      table.string('nom').notNullable()
      table
        .string('domaineId', 1)
        .notNullable()
        .references('domaines.id')
      table.enum('type', ['fossile', 'minérale'])
      table.string('symbole')
      table.specificType('alias', 'character varying(255)[]')
      table.integer('gerep')
      table.string('description', 2048)
      table
        .string('substanceLegalId')
        .references('substancesLegals.id')
        .notNullable()
    })
}

exports.down = knex => {
  return knex.schema.dropTable('substances').dropTable('substancesLegals')
}
