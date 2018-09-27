exports.up = knex => {
  return knex.schema
    .createTable('titresDemarches', table => {
      table.string('id', 128).primary()
      table
        .string('titreId', 128)
        .references('titres.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('demarcheId', 8)
        .notNullable()
        .references('demarches.id')
      table
        .string('demarcheStatutId', 3)
        .notNullable()
        .references('demarchesStatuts.id')
      table.integer('ordre')
    })
    .createTable('titresPhases', table => {
      table
        .string('titreDemarcheId', 128)
        .primary()
        .references('titresDemarches.id')
        .onDelete('CASCADE')
      table
        .string('phaseStatutId', 3)
        .notNullable()
        .references('phasesStatuts.id')
      table.date('dateDebut')
      table.date('dateFin')
    })
    .createTable('titresEtapes', table => {
      table.string('id', 128).primary()
      table
        .string('titreDemarcheId', 128)
        .references('titresDemarches.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('etapeId', 3)
        .notNullable()
        .references('etapes.id')
      table
        .string('etapeStatutId', 3)
        .notNullable()
        .references('etapesStatuts.id')
      table.integer('ordre')
      table.date('date').notNullable()
      table.date('dateDebut')
      table.date('dateFin')
      table.integer('duree')
      table.float('surface')
      table.float('volume')
      table.string('volumeUnite')
      table.specificType('visas', 'text[]')
      table.float('engagement')
      table.string('engagementDevise')
      table.boolean('sourceIndisponible')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('titresEtapes')
    .dropTable('titresPhases')
    .dropTable('titresDemarches')
}
