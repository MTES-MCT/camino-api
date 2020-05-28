exports.up = knex => {
  return knex.schema
    .createTable('demarchesTypes', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.text('description')
      table.integer('ordre')
      table.boolean('duree')
      table.boolean('points')
      table.boolean('substances')
      table.boolean('titulaires')
      table.boolean('renouvelable')
      table.boolean('exception')
      table.boolean('auto')
    })
    .createTable('titresTypes__demarchesTypes', table => {
      table
        .string('titreTypeId', 3)
        .references('titresTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('demarcheTypeId', 3)
        .references('demarchesTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table.integer('dureeMax')
      table.boolean('acceptationImplicite')
      table.string('delaiImplicite')
      table.string('delaiRecours')
      table.string('legalRef')
      table.string('legalLien')
      table.string('dateDebut', 10)
      table.string('dateFin', 10)
      table.primary(['titreTypeId', 'demarcheTypeId'])
    })
    .createTable('demarchesStatuts', table => {
      table.string('id', 3).primary()
      table.string('nom', 32).notNullable()
      table.text('description')
      table.string('couleur', 16).notNullable()
      table.integer('ordre').notNullable()
    })
    .createTable('phasesStatuts', table => {
      table.string('id', 3).primary()
      table.string('nom', 32).notNullable()
      table.string('couleur', 16).notNullable()
    })
    .createTable('etapesTypes', table => {
      table.string('id', 3).primary()
      table.string('nom', 128)
      table.text('description')
      table.integer('ordre')
      table.boolean('fondamentale')
      table.boolean('unique')
      table.boolean('acceptationAuto')
      table.string('legalRef')
      table.string('legalLien')
      table.string('dateDebut', 10)
      table.string('dateFin', 10)
      table.specificType('sections', 'jsonb[]')
    })
    .createTable('titresTypes__demarchesTypes__etapesTypes', table => {
      table
        .string('titreTypeId', 3)
        .references('titresTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table.integer('ordre')
      table
        .string('demarcheTypeId', 7)
        .references('demarchesTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('etapeTypeId', 3)
        .references('etapesTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table.specificType('sections', 'jsonb[]')
      table.primary(['titreTypeId', 'demarcheTypeId', 'etapeTypeId'])
    })
    .createTable('etapesStatuts', table => {
      table.string('id', 3).primary()
      table.string('nom', 32).notNullable()
      table.text('description')
      table.string('couleur', 16).notNullable()
    })
    .createTable('etapesTypes__etapesStatuts', table => {
      table
        .string('etapeTypeId', 7)
        .references('etapesTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('etapeStatutId', 3)
        .references('etapesStatuts.id')
        .notNullable()
        .onDelete('CASCADE')
      table.integer('ordre')
      table.primary(['etapeTypeId', 'etapeStatutId'])
    })
    .createTable('documentsTypes', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.string('repertoire').notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('etapesTypes__etapesStatuts')
    .dropTable('etapesStatuts')
    .dropTable('titresTypes__demarchesTypes__etapesTypes')
    .dropTable('etapesTypes')
    .dropTable('demarchesStatuts')
    .dropTable('titresTypes__demarchesTypes')
    .dropTable('demarchesTypes')
    .dropTable('phasesStatuts')
    .dropTable('documentsTypes')
}
