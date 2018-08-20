exports.up = knex => {
  return knex.schema
    .createTable('demarches', table => {
      table.string('id', 8).primary()
      table.string('nom').notNullable()
      table.integer('ordre')
      table.boolean('duree')
      table.boolean('points')
      table.boolean('substances')
      table.boolean('titulaires')
      table.boolean('renouvelable')
      table.boolean('exception')
    })
    .createTable('demarches__types', table => {
      table
        .string('typeId', 3)
        .references('types.id')
        .notNullable()
      table
        .string('demarcheId', 3)
        .references('demarches.id')
        .notNullable()
      table.integer('dureeMax')
      table.boolean('acceptationImplicite')
      table.string('delaiImplicite')
      table.string('delaiRecours')
      table.string('legalRef')
      table.string('legalLien')
      table.date('dateDebut')
      table.date('dateFin')
      table.primary(['demarcheId', 'typeId'])
    })
    .createTable('demarchesStatuts', table => {
      table.string('id', 3).primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
    })
    .createTable('demarches__demarchesStatuts', table => {
      table
        .string('demarcheId', 3)
        .references('demarches.id')
        .notNullable()
      table
        .string('demarcheStatutId', 3)
        .references('demarchesStatuts.id')
        .notNullable()
      table.integer('ordre')
      table.primary(['demarcheId', 'demarcheStatutId'])
    })
    .createTable('etapes', table => {
      table.string('id', 3).primary()
      table.string('nom', 128)
      table.boolean('acceptationAuto')
      table.string('legalRef')
      table.string('legalLien')
      table.date('dateDebut')
      table.date('dateFin')
    })
    .createTable('demarches__etapes', table => {
      table
        .string('demarcheId', 7)
        .references('demarches.id')
        .notNullable()
      table
        .string('etapeId', 3)
        .references('etapes.id')
        .notNullable()
      table
        .string('typeId', 3)
        .references('types.id')
        .notNullable()
      table.integer('ordre')
      table.primary(['demarcheId', 'etapeId', 'typeId'])
    })
    .createTable('etapesStatuts', table => {
      table.string('id', 3).primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
    })
    .createTable('etapes__etapesStatuts', table => {
      table
        .string('etapeId', 7)
        .references('etapes.id')
        .notNullable()
      table
        .string('etapeStatutId', 3)
        .references('etapesStatuts.id')
        .notNullable()
      table.integer('ordre')
      table.primary(['etapeId', 'etapeStatutId'])
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('etapes__etapesStatuts')
    .dropTable('etapesStatuts')
    .dropTable('demarches__etapes')
    .dropTable('demarches__demarchesStatuts')
    .dropTable('demarchesStatuts')
    .dropTable('demarches__types')
    .dropTable('demarches')
    .dropTable('etapes')
}
