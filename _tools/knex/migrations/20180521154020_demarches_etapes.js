exports.up = knex => {
  return knex.schema
    .createTable('demarchesTypes', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.integer('ordre')
      table.boolean('duree')
      table.boolean('points')
      table.boolean('substances')
      table.boolean('titulaires')
      table.boolean('renouvelable')
      table.boolean('exception')
    })
    .createTable('demarchesTypes__types', table => {
      table
        .string('typeId', 3)
        .references('types.id')
        .notNullable()
      table
        .string('demarcheTypeId', 3)
        .references('demarchesTypes.id')
        .notNullable()
      table.integer('dureeMax')
      table.boolean('acceptationImplicite')
      table.string('delaiImplicite')
      table.string('delaiRecours')
      table.string('legalRef')
      table.string('legalLien')
      table.date('dateDebut')
      table.date('dateFin')
      table.primary(['demarcheTypeId', 'typeId'])
    })
    .createTable('demarchesStatuts', table => {
      table.string('id', 3).primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
    })
    .createTable('demarchesTypes__demarchesStatuts', table => {
      table
        .string('demarcheTypeId', 3)
        .references('demarchesTypes.id')
        .notNullable()
      table
        .string('demarcheStatutId', 3)
        .references('demarchesStatuts.id')
        .notNullable()
      table.integer('ordre')
      table.primary(['demarcheTypeId', 'demarcheStatutId'])
    })
    .createTable('phasesStatuts', table => {
      table.string('id', 3).primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
    })
    .createTable('etapesTypes', table => {
      table.string('id', 3).primary()
      table.string('nom', 128)
      table.boolean('acceptationAuto')
      table.string('legalRef')
      table.string('legalLien')
      table.date('dateDebut')
      table.date('dateFin')
    })
    .createTable('demarchesTypes__etapesTypes', table => {
      table
        .string('demarcheTypeId', 7)
        .references('demarchesTypes.id')
        .notNullable()
      table
        .string('etapeTypeId', 3)
        .references('etapesTypes.id')
        .notNullable()
      table
        .string('typeId', 3)
        .references('types.id')
        .notNullable()
      table.integer('ordre')
      table.primary(['demarcheTypeId', 'etapeTypeId', 'typeId'])
    })
    .createTable('etapesStatuts', table => {
      table.string('id', 3).primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
    })
    .createTable('etapesTypes__etapesStatuts', table => {
      table
        .string('etapeTypeId', 7)
        .references('etapesTypes.id')
        .notNullable()
      table
        .string('etapeStatutId', 3)
        .references('etapesStatuts.id')
        .notNullable()
      table.integer('ordre')
      table.primary(['etapeTypeId', 'etapeStatutId'])
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('etapesTypes__etapesStatuts')
    .dropTable('etapesStatuts')
    .dropTable('demarchesTypes__etapesTypes')
    .dropTable('etapesTypes')
    .dropTable('demarchesTypes__demarchesStatuts')
    .dropTable('demarchesStatuts')
    .dropTable('demarchesTypes__types')
    .dropTable('demarchesTypes')
    .dropTable('phasesStatuts')
}
