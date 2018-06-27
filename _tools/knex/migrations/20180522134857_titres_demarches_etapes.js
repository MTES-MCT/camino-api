exports.up = knex => {
  return knex.schema
    .createTable('titres_demarches', table => {
      table.string('id', 128).primary()
      table
        .string('titre_id', 128)
        .references('titres.id')
        // .notNullable()
        .onDelete('CASCADE')
      table
        .string('demarche_id', 8)
        .notNullable()
        .references('demarches.id')
      table
        .string('demarche_statut_id', 3)
        .notNullable()
        .references('demarches_statuts.id')
      table.integer('ordre')
    })
    .createTable('titres_demarches_etapes', table => {
      table.string('id', 128).primary()
      table
        .string('titre_demarche_id', 128)
        .references('titres_demarches.id')
        // .notNullable()
        .onDelete('CASCADE')
      table
        .string('etape_id', 3)
        .notNullable()
        .references('etapes.id')
      table
        .string('etape_statut_id', 3)
        .notNullable()
        .references('etapes_statuts.id')
      table.integer('ordre')
      table.date('date').notNullable()
      table.integer('duree').notNullable()
      table.float('surface')
      table.boolean('points')
      table.boolean('points_securite')
      table.boolean('substances')
      table.boolean('titulaires')
      table.boolean('amodiataires')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('titres_demarches')
    .dropTable('titres_demarches_etapes')
}
