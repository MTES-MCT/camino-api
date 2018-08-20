exports.up = knex => {
  return knex.schema.createTable('titresDocuments', table => {
    table.string('id').primary()
    table
      .string('titreEtapeId', 128)
      .references('titresEtapes.id')
      .notNullable()
      .onDelete('CASCADE')
    table.string('type', 16).notNullable()
    table.string('nom', 1024).notNullable()
    table.string('jorf', 32)
    table.string('nor', 32)
    table.string('url')
    table.string('uri')
    table.string('fichier')
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresDocuments')
}
