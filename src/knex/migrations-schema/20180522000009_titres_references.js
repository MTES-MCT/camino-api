exports.up = knex => {
  return knex.schema.createTable('titresReferences', table => {
    table.string('titreId', 128).notNullable().index()
    table
      .foreign('titreId')
      .references('titres.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .string('typeId', 3)
      .index()
      .references('referencesTypes.id')
      .notNullable()
    table.string('nom')
    table.primary(['titreId', 'typeId', 'nom'])
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresReferences')
}
