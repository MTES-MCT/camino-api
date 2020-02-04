exports.up = knex => {
  return knex.schema
    .createTable('activitesTypes', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.specificType('sections', 'jsonb[]').notNullable()
      table
        .string('frequenceId', 3)
        .notNullable()
        .references('frequences.id')
      table.string('dateDebut').notNullable()
      table.integer('delaiMois')
    })
    .createTable('titresTypes__activitesTypes', table => {
      table
        .string('titreTypeId', 3)
        .references('titresTypes.id')
        .notNullable()
      table
        .string('activiteTypeId', 3)
        .references('activitesTypes.id')
        .notNullable()
      table.primary(['titreTypeId', 'activiteTypeId'])
    })
    .createTable('activitesTypes__pays', table => {
      table
        .string('paysId', 3)
        .notNullable()
        .references('pays.id')
      table
        .string('activiteTypeId', 3)
        .references('activitesTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table.primary(['paysId', 'activiteTypeId'])
    })
    .createTable('activitesTypes__administrations', table => {
      table
        .string('activiteTypeId', 3)
        .references('activitesTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('administrationId', 64)
        .notNullable()
        .references('administrations.id')
      table.primary(['administrationId', 'activiteTypeId'])
    })
    .createTable('activitesStatuts', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.string('couleur', 16).notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('activitesTypes__pays')
    .dropTable('titresTypes__activitesTypes')
    .dropTable('activitesTypes__administrations')
    .dropTable('activitesTypes')
    .dropTable('activitesStatuts')
}
