exports.up = knex => {
  return knex.schema
    .createTable('demarches', table => {
      table.string('id', 8).primary()
      table
        .string('type_id', 3)
        .references('types.id')
        .notNullable()
      table.string('nom').notNullable()
      table.integer('duree_max')
      table.integer('ordre')
      table.boolean('renouvelable')
      table.boolean('exception')
      table.boolean('duree')
      table.boolean('points')
      table.boolean('substances')
      table.boolean('titulaires')
    })
    .createTable('etapes', table => {
      table.string('id', 3).primary()
      table.string('nom', 128)
      table.boolean('acceptation_auto')
      table.date('date_debut')
      table.date('date_fin')
    })
    .createTable('_demarches_etapes', table => {
      table
        .string('demarche_id', 7)
        .references('demarches.id')
        .notNullable()
      table
        .string('etape_id', 3)
        .references('etapes.id')
        .notNullable()
      table.integer('ordre')
      table.primary(['demarche_id', 'etape_id'])
    })
    .createTable('demarches_statuts', table => {
      table
        .enum('id', ['ins', 'acc', 'rej', 'eco', 'dep', 'cls', 'ret'])
        .primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
    })
    .createTable('etapes_statuts', table => {
      table.enum('id', ['eco', 'ter', 'afa']).primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('_demarches_etapes')
    .dropTable('demarches')
    .dropTable('etapes')
    .dropTable('demarches_statuts')
    .dropTable('etapes_statuts')
}
