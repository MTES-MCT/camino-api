exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('titresPhases', table => {
      table.string('id', 128).primary()
      table
        .string('titreId', 128)
        .references('titres.id')
        // .notNullable()
        .onDelete('CASCADE')
      table.string('phaseId', 8).notNullable()
      table.date('date').notNullable()
      table.integer('duree').notNullable()
      table.float('surface')
      table.integer('position')
    })
    .createTable('titresPhasesEmprises', table => {
      table
        .string('titrePhaseId', 128)
        .notNullable()
        .references('titresPhases.id')
        .onDelete('CASCADE')
      table
        .string('empriseId', 3)
        .notNullable()
        .references('titresEmprises.id')
      table.primary(['titrePhaseId', 'empriseId'])
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('titresPhases').dropTable('titresPhasesEmprises')
}
