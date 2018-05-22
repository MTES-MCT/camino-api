exports.up = (knex, Promise) => {
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
      table.enum('domaine', ['mines', 'carrières']).notNullable()
      table.enum('type', ['fossile', 'minérale']).notNullable()
      table
        .enum('usage', [
          'énergétique',
          'non énergétique',
          'énergétique (nucléaire)'
        ])
        .notNullable()
      table.string('symbole')
      table.specificType('alias', 'text[]')
      table.integer('gerep')
      table.string('description', 2048)
      table
        .string('legalId')
        .references('substancesLegals.id')
        .notNullable()
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('substances').dropTable('substancesLegals')
}
