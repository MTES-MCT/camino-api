exports.up = knex => {
  return knex.schema
    .createTable('demarches', table => {
      table.string('id', 8).primary()
      table
        .string('typeId', 3)
        .references('types.id')
        .notNullable()
      table.string('nom').notNullable()
      table.integer('dureeMax')
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
      table.boolean('acceptationAuto')
      table.date('dateDebut')
      table.date('dateFin')
    })
    .createTable('DemarchesEtapes', table => {
      table
        .string('demarcheId', 7)
        .references('demarches.id')
        .notNullable()
      table
        .string('etapeId', 3)
        .references('etapes.id')
        .notNullable()
      table.integer('ordre')
      table.primary(['demarcheId', 'etapeId'])
    })
    .createTable('demarchesStatuts', table => {
      table
        .enum('id', ['ins', 'acc', 'rej', 'eco', 'dep', 'cls', 'ret'])
        .primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
    })
    .createTable('etapesStatuts', table => {
      table.enum('id', ['eco', 'ter', 'afa']).primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('demarchesEtapes')
    .dropTable('demarches')
    .dropTable('etapes')
    .dropTable('demarchesStatuts')
    .dropTable('etapesStatuts')
}
