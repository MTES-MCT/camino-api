exports.up = knex => {
  return knex.schema.createTable('titresReferences', table => {
    table.string('titreId', 128).notNullable()
    table
      .foreign('titreId')
      .references('titres.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table.string('typeId', 3).references('referencesTypes.id').notNullable()
    table.string('nom')
    table.primary(['titreId', 'typeId', 'nom'])
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresReferences')
}
