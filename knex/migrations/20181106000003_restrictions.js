exports.up = knex =>
  knex.schema
    .createTable('restrictions__domaines', table => {
      table
        .string('domaineId')
        .references('domaines.id')
        .notNullable()
      table.boolean('publicLectureInterdit').notNullable()
    })
    .createTable('restrictions__types__statuts', table => {
      table
        .string('titreTypeId')
        .references('titresTypes.id')
        .notNullable()
      table
        .string('statutId')
        .references('titresStatuts.id')
        .notNullable()
      table.boolean('publicLectureInterdit').notNullable()
    })
    .createTable('restrictions__types__administrations', table => {
      table
        .string('titreTypeId')
        .references('titresTypes.id')
        .notNullable()
      table
        .string('administrationId')
        .references('administrations.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.boolean('creationInterdit')
    })
    .createTable('restrictions__types__statuts__administrations', table => {
      table
        .string('titreTypeId')
        .references('titresTypes.id')
        .notNullable()
      table
        .string('statutId')
        .references('titresStatuts.id')
        .notNullable()
      table
        .string('administrationId')
        .references('administrations.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.boolean('creationInterdit')
      table.boolean('lectureInterdit')
      table.boolean('modificationInterdit')
    })
    .createTable('restrictions__etapesTypes', table => {
      table.string('etapeTypeId', 3).primary()
      table.boolean('publicLectureInterdit')
      table.boolean('entreprisesLectureInterdit')
    })
    .createTable('restrictions__etapesTypes__administrations', table => {
      table
        .string('etapeTypeId')
        .references('etapesTypes.id')
        .notNullable()
      table
        .string('administrationId')
        .references('administrations.id')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.boolean('creationInterdit')
      table.boolean('lectureInterdit')
      table.boolean('modificationInterdit')
    })

exports.down = knex =>
  knex.schema
    .dropTable('restrictions__domaines')
    .dropTable('restrictions__types__statuts')
    .dropTable('restrictions__types__administrations')
    .dropTable('restrictions__types__statuts__administrations')
    .dropTable('restrictions__etapesTypes')
    .dropTable('restrictions__etapesTypes__administrations')
