exports.up = knex =>
  knex.schema
    .createTable('activitesTypes', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.specificType('sections', 'jsonb[]').notNullable()
      table
        .string('frequenceId', 3)
        .notNullable()
        .index()
        .references('frequences.id')
      table.string('dateDebut').notNullable()
      table.integer('delaiMois')
      table.string('satisfaction_url')
      table.integer('ordre').notNullable()
      table.string('email', 128)
    })
    .createTable('activitesTypes__titresTypes', table => {
      table
        .string('titreTypeId', 3)
        .index()
        .references('titresTypes.id')
        .notNullable()
      table
        .string('activiteTypeId', 3)
        .index()
        .references('activitesTypes.id')
        .notNullable()
      table.primary(['activiteTypeId', 'titreTypeId'])
    })
    .createTable('activitesTypes__pays', table => {
      table.string('paysId', 3).notNullable().index().references('pays.id')
      table
        .string('activiteTypeId', 3)
        .index()
        .references('activitesTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table.primary(['paysId', 'activiteTypeId'])
    })
    .createTable('activitesTypes__documentsTypes', table => {
      table
        .string('activiteTypeId', 3)
        .index()
        .references('activitesTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('documentTypeId', 3)
        .index()
        .references('documentsTypes.id')
        .notNullable()
      table.boolean('optionnel')
      table.primary(['activiteTypeId', 'documentTypeId'])
    })
    .createTable('activitesStatuts', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.string('couleur', 16).notNullable()
    })

exports.down = knex =>
  knex.schema
    .dropTable('activitesTypes__pays')
    .dropTable('activitesTypes__documentsTypes')
    .dropTable('activitesTypes__titresTypes')
    .dropTable('activitesTypes')
    .dropTable('activitesStatuts')
