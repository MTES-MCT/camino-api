exports.up = knex => {
  return knex.schema.createTable('travauxRapports', table => {
    table.string('id')
    table
      .string('titreId', 128)
      .primary()
      .references('titres.id')
      .onDelete('CASCADE')
    table.boolean('date')
    table.jsonb('contenu')
  })
}

exports.down = knex => {
  return knex.schema.dropTable('travauxRapports')
}
