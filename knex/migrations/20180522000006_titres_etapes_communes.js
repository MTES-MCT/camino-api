exports.up = knex => {
  return knex.schema.createTable('titresCommunes', table => {
    table.string('titreEtapeId', 128).notNullable()
    table
      .foreign('titreEtapeId')
      .references('titresEtapes.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .string('communeId', 8)
      .notNullable()
      .references('communes.id')
    table.primary(['titreEtapeId', 'communeId'])
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresCommunes')
}
