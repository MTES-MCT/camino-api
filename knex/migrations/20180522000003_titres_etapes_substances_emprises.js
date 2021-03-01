exports.up = knex => {
  return knex.schema.createTable('titresSubstances', table => {
    table.string('titreEtapeId', 128).notNullable().index()
    table
      .foreign('titreEtapeId')
      .references('titresEtapes.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .string('substanceId', 4)
      .index()
      .references('substances.id')
      .notNullable()
    table.integer('ordre')
    table.primary(['titreEtapeId', 'substanceId'])
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresSubstances')
}
