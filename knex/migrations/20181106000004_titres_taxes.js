exports.up = knex => {
  return knex.schema.createTable('titresTaxes', table => {
    table.string('id').primary()
    table
      .string('titreId', 128)
      .references('titres.id')
      .onDelete('CASCADE')
    table.date('date')
    table.date('dateSaisie')
    table.jsonb('contenu')
    table
      .string('taxeTypeId', 3)
      .references('taxesTypes.id')
      .notNullable()
    table.string('taxeStatutId', 3).references('taxesStatuts.id')
    table.integer('annee', 4).notNullable()
    table.integer('frequencePeriodeId', 2)
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresTaxes')
}
