exports.up = (knex, Promise) => {
  return knex.schema.createTable('titresSubstancesSecondaires', table => {
    table.string('titreId', 32).references('titres.id')
    table.string('substanceId', 4).references('substances.id')
    table.primary(['titreId', 'substanceId'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('titresSubstances')
}
