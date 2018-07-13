exports.up = knex => {
  return knex.schema.createTable('titresDocuments', table => {
    table.string('id').primary()
    table
      .string('titreEtapeId', 128)
      .references('titresEtapes.id')
      .notNullable()
      .onDelete('CASCADE')
    table.string('nom').notNullable()
    table.date('date').notNullable()
    table.string('url').notNullable()
    table.string('fichier').notNullable()
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresDocuments')
}
