exports.up = knex => {
  return knex.schema
    .createTable('titresDemarches', table => {
      table.string('id', 128).primary()
      table
        .string('titreId', 128)
        .references('titres.id')
        // .notNullable()
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
    .createTable('titresEtapes', table => {
      table.string('id', 128).primary()
      table
        .string('titreDemarcheId', 128)
        .references('titresDemarches.id')
        // .notNullable()
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
      table.integer('duree')
      table.date('echeance')
      table.float('surface')
      table.specificType('visas', 'text[]')
      table.integer('engagement')
      table.string('engagementDevise')
      table.boolean('points')
      table.boolean('pointsSecurite')
      table.boolean('substances')
      table.boolean('titulaires')
      table.boolean('amodiataires')
    })
}

exports.down = knex => {
  return knex.schema.dropTable('titresEtapes').dropTable('titresDemarches')
}
