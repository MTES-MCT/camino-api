exports.up = knex => {
  return knex.schema
    .createTable('activitesTypes', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.specificType('sections', 'jsonb[]')
      table
        .string('frequenceId', 3)
        .notNullable()
        .references('frequences.id')
    })
    .createTable('activitesTypes__types', table => {
      table
        .string('domaineId', 1)
        .references('domaines.id')
        .notNullable()
      table
        .string('typeId', 3)
        .references('types.id')
        .notNullable()
      table
        .string('activiteTypeId', 3)
        .references('activitesTypes.id')
        .notNullable()
      table.primary(['domaineId', 'typeId', 'activiteTypeId'])
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
    .createTable('activitesStatuts', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.string('couleur', 16).notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('activitesTypes__pays')
    .dropTable('activitesTypes__types')
    .dropTable('activitesTypes')
    .dropTable('activitesStatuts')
}
