exports.up = knex => {
  return knex.schema.createTable('titresTravauxRapports', table => {
    table.string('id').primary()
    table
      .string('titreId', 128)
      .references('titres.id')
      .onDelete('CASCADE')
    table.date('date')
    table.boolean('confirmation')
    table.jsonb('contenu')
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresTravauxRapports')
}
