exports.up = knex =>
  knex.schema
    .createTable('autorisations__domaines', table => {
      table
        .string('domaineId')
        .references('domaines.id')
        .notNullable()
      table.boolean('publicLecture').notNullable()
    })
    .createTable('autorisations__titresTypes__titresStatuts', table => {
      table
        .string('titreTypeId')
        .references('titresTypes.id')
        .notNullable()
      table
        .string('titreStatutId')
        .references('titresStatuts.id')
        .notNullable()
      table.boolean('publicLecture').notNullable()
    })
    .createTable('autorisations__etapesTypes', table => {
      table.string('etapeTypeId', 3).primary()
      table.boolean('publicLecture')
      table.boolean('entreprisesLecture')
    })
    .createTable('autorisations__titresTypes__administrations', table => {
      table
        .string('administrationId')
        .references('administrations.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('titreTypeId')
        .references('titresTypes.id')
        .notNullable()
      table.boolean('gestionnaire').notNullable()
      table.boolean('associee').notNullable()
    })
    .createTable(
      'restrictions__titresTypes__titresStatuts__administrations',
      table => {
        table
          .string('administrationId')
          .references('administrations.id')
          .notNullable()
          .onUpdate('CASCADE')
          .onDelete('CASCADE')
        table
          .string('titreTypeId')
          .references('titresTypes.id')
          .notNullable()
        table
          .string('titreStatutId')
          .references('titresStatuts.id')
          .notNullable()
        table.boolean('titresModificationInterdit').notNullable()
        table.boolean('demarchesModificationInterdit').notNullable()
        table.boolean('etapesModificationInterdit').notNullable()
      }
    )
    .createTable(
      'restrictions__titresTypes__etapesTypes__administrations',
      table => {
        table
          .string('administrationId')
          .references('administrations.id')
          .notNullable()
          .onUpdate('CASCADE')
          .onDelete('CASCADE')
        table
          .string('titreTypeId')
          .references('titresTypes.id')
          .notNullable()
        table
          .string('etapeTypeId')
          .references('etapesTypes.id')
          .notNullable()
        table.boolean('lectureInterdit').notNullable()
        table.boolean('creationInterdit').notNullable()
        table.boolean('modificationInterdit').notNullable()
      }
    )

exports.down = knex =>
  knex.schema
    .dropTable('autorisations__domaines')
    .dropTable('autorisations__titresTypes__titresStatuts')
    .dropTable('autorisations__etapesTypes')
    .dropTable('administrations__titresTypes')
    .dropTable('administrations__titresTypes__titresStatuts')
    .dropTable('administrations__titresTypes__etapesTypes')
