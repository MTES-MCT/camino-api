exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('titresPhases', table => {
      table.string('id', 128).primary()
      table.string('titreId', 128).references('titres.id')
      table.string('phaseId', 8).notNullable()
      table.date('date').notNullable()
      table.integer('duree').notNullable()
      table.integer('surface')
      table.integer('position')
    })
    .createTable('titresPhasesEmprises', table => {
      table
        .string('phaseId', 128)
        .notNullable()
        .references('titresPhases.id')
      table
        .string('empriseId', 3)
        .notNullable()
        .references('titresEmprises.id')
      table.primary(['phaseId', 'empriseId'])
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('titresPhases').dropTable('titresPhasesEmprises')
}
