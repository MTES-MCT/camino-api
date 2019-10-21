exports.up = knex => {
  return knex.schema.createTable('titresSubstances', table => {
    table.string('titreEtapeId', 128).notNullable()
    table
      .foreign('titreEtapeId')
      .references('titresEtapes.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .string('substanceId', 4)
      .references('substances.id')
      .notNullable()
    table.boolean('connexe')
    table.integer('ordre')
    table.primary(['titreEtapeId', 'substanceId'])
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresSubstances')
}
