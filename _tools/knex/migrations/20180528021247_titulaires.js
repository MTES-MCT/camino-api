exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('titulaires', table => {
      table.string('id').primary()
      table.string('nom', 128).notNullable()
      table.string('service')
      // table.string('adresseId', 128).references('adresses.id')
      table.string('telephone')
      table.string('email')
      table.string('site')
    })
    .createTable('titresTitulaires', table => {
      table
        .string('titreId', 128)
        .notNullable()
        .references('titres.id')
        .onDelete('CASCADE')
      table
        .string('titulaireId', 128)
        .notNullable()
        .references('titulaires.id')
        .onDelete('CASCADE')
      table.primary(['titreId', 'titulaireId'])
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('titulaires').dropTable('titresTitulaires')
}
