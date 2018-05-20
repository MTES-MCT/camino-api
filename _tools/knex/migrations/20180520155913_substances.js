exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('substances', table => {
      table.string('id').primary()
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
      table.string('legal_id').references('substanceLegals.id')
    }),

    knex.schema.createTable('substanceLegals', table => {
      table.string('id').primary()
      table.string('nom')
      table.string('description')
      table.string('lien')
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('substances').dropTable('substanceLegals')
  ])
}
