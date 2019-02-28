exports.up = knex => {
  return knex.schema.createTable('titresActivitesRapports', table => {
    table.string('id').primary()
    table
      .string('titreId', 128)
      .references('titres.id')
      .onDelete('CASCADE')
    table.string('utilisateurId', 128).references('utilisateurs.id')
    table.date('date')
    table.boolean('confirmation')
    table.jsonb('contenu')
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresActivitesRapports')
}
