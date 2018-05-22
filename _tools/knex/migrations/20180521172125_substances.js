exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('substancesLegals', table => {
      table.string('id').primary()
      table.string('nom')
      table.string('description')
      table.string('lien')
    })
    .createTable('substances', table => {
      table.string('id', 4).primary()
      table.string('nom')
      table.enum('domaine', ['mines', 'carrières'])
      table.enum('type', ['fossile', 'minérale'])
      table.enum('usage', [
        'énergétique',
        'non énergétique',
        'énergétique (nucléaire)'
      ])
      table.string('symbole')
      table.specificType('alias', 'text[]')
      table.integer('gerep')
      table.string('description', 2048)
      table.string('legalId').references('substancesLegals.id')
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('substances').dropTable('substancesLegals')
}
