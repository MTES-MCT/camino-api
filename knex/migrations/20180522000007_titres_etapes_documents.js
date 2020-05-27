exports.up = knex => {
  return knex.schema.createTable('titresDocuments', table => {
    table.string('id').primary()
    table.string('titreEtapeId', 128).notNullable()
    table
      .foreign('titreEtapeId')
      .references('titresEtapes.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .string('typeId', 3)
      .references('documentsTypes.id')
      .notNullable()
    table.string('description', 1024)
    table.boolean('fichier')
    table.string('fichierTypeId', 3)
    table.string('jorf', 32)
    table.string('nor', 32)
    table.string('url', 1024)
    table.string('uri', 1024)
    table.boolean('public')
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresDocuments')
}
