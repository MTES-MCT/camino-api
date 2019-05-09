exports.up = knex => {
  return knex.schema.createTable('titresDocuments', table => {
    table.string('id').primary()
    table.string('titreEtapeId', 128).notNullable()
    table
      .foreign('titreEtapeId')
      .references('titresEtapes.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table.string('type', 32).notNullable()
    table.string('nom', 1024).notNullable()
    table.string('jorf', 32)
    table.string('nor', 32)
    table.string('url')
    table.string('uri')
    table.string('fichier')
    table.boolean('public')
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresDocuments')
}
