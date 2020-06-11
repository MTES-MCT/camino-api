exports.up = knex =>
  knex.schema
    .createTable('a__titresTypes__titresStatuts', table => {
      table.string('titreTypeId').references('titresTypes.id').notNullable()
      table.string('titreStatutId').references('titresStatuts.id').notNullable()
      table.boolean('publicLecture').notNullable()
      table.primary(['titreTypeId', 'titreStatutId'])
    })
    .createTable('a__etapesTypes', table => {
      table.string('etapeTypeId', 3).primary()
      table.boolean('publicLecture')
      table.boolean('entreprisesLecture')
    })

    .createTable('a__titresTypes__administrations', table => {
      table
        .string('administrationId')
        .references('administrations.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.string('titreTypeId').references('titresTypes.id').notNullable()
      table.boolean('gestionnaire').notNullable()
      table.boolean('associee').notNullable()
      table.primary(['administrationId', 'titreTypeId'])
    })
    .createTable('r__titresTypes__titresStatuts__administrations', table => {
      table
        .string('administrationId')
        .references('administrations.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.string('titreTypeId').references('titresTypes.id').notNullable()
      table.string('titreStatutId').references('titresStatuts.id').notNullable()
      table.boolean('titresModificationInterdit').notNullable()
      table.boolean('demarchesModificationInterdit').notNullable()
      table.boolean('etapesModificationInterdit').notNullable()
      table.primary(['administrationId', 'titreTypeId', 'titreStatutId'])
    })
    .createTable('r__titresTypes__etapesTypes__administrations', table => {
      table
        .string('administrationId')
        .references('administrations.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.string('titreTypeId').references('titresTypes.id').notNullable()
      table.string('etapeTypeId').references('etapesTypes.id').notNullable()
      table.boolean('lectureInterdit').notNullable()
      table.boolean('creationInterdit').notNullable()
      table.boolean('modificationInterdit').notNullable()
      table.primary(['administrationId', 'titreTypeId', 'etapeTypeId'])
    })

exports.down = knex =>
  knex.schema
    .dropTable('a__titresTypes__titresStatuts')
    .dropTable('a__etapesTypes')

    .dropTable('a__titresTypes__administrations')
    .dropTable('r__titresTypes__titresStatuts__administrations')
    .dropTable('r__titresTypes__etapesTypes__administrations')
