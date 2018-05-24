exports.up = (knex, Promise) => {
  return knex.schema.createTable('titresSubstancesPrincipales', table => {
    table
      .string('titreId', 32)
      .references('titres.id')
      .onDelete('CASCADE')
      .notNullable()
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
