exports.up = knex => {
  return knex.schema
    .createTable('taxesTypes', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.specificType('sections', 'jsonb[]')
      table
        .string('frequenceId', 3)
        .notNullable()
        .references('frequences.id')
    })
    .createTable('taxesTypes__types', table => {
      table
        .string('domaineId', 1)
        .references('domaines.id')
        .notNullable()
      table
        .string('typeId', 3)
        .references('types.id')
        .notNullable()
      table
        .string('taxeTypeId', 3)
        .references('taxesTypes.id')
        .notNullable()
      table.primary(['domaineId', 'typeId', 'taxeTypeId'])
    })
    .createTable('taxesTypes__pays', table => {
      table
        .string('paysId', 3)
        .notNullable()
        .references('pays.id')
      table
        .string('taxeTypeId', 3)
        .references('taxesTypes.id')
        .notNullable()
        .onDelete('CASCADE')
      table.primary(['paysId', 'taxeTypeId'])
    })
    .createTable('taxesStatuts', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
      table.string('couleur', 16).notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('taxesTypes__pays')
    .dropTable('taxesTypes__types')
    .dropTable('taxesTypes')
    .dropTable('taxesStatuts')
}
