exports.up = (knex, Promise) => {
  return knex.schema.createTable('titresSubstancesConnexes', table => {
    table
      .string('titreId', 64)
      .references('titres.id')
      .notNullable()
      .onDelete('CASCADE')
    table
      .string('substanceId', 4)
      .references('substances.id')
      .notNullable()
    table.primary(['titreId', 'substanceId'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('titresSubstances')
}
