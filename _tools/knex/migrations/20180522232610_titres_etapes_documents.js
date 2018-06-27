exports.up = knex => {
  return knex.schema.createTable('titres_documents', table => {
    table.string('id').primary()
    table
      .string('titre_demarche_etape_id', 128)
      .references('titres_demarches_etapes.id')
      .notNullable()
      .onDelete('CASCADE')
    table.string('nom').notNullable()
    table.date('date').notNullable()
    table.string('url').notNullable()
    table.string('fichier').notNullable()
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titres_documents')
}
