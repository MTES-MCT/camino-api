exports.up = knex => {
  return knex.schema
    .createTable('substances_legals', table => {
      table.string('id').primary()
      table.string('nom').notNullable()
      table.string('description').notNullable()
      table.string('lien').notNullable()
    })
    .createTable('substances', table => {
      table.string('id', 4).primary()
      table.string('nom').notNullable()
      table
        .string('domaine_id', 1)
        .notNullable()
        .references('domaines.id')
      table.enum('type', ['fossile', 'minérale'])
      table.string('usage').notNullable()
      table.string('symbole')
      table.specificType('alias', 'character varying(255)[]')
      table.integer('gerep')
      table.string('description', 2048)
      table
        .string('substance_legal_id')
        .references('substances_legals.id')
        .notNullable()
    })
}

exports.down = knex => {
  return knex.schema.dropTable('substances').dropTable('substances_legals')
}
