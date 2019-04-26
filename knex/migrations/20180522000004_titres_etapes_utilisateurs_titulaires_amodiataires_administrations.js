exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('titresTitulaires', table => {
      table.string('titreEtapeId', 128).notNullable()
      table
        .foreign('titreEtapeId')
        .references('titresEtapes.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('entrepriseId', 64)
        .references('entreprises.id')
        .notNullable()
      table.boolean('operateur')
      table.primary(['titreEtapeId', 'entrepriseId'])
    })
    .createTable('titresAmodiataires', table => {
      table
        .string('titreEtapeId', 128)
        .references('titresEtapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('entrepriseId', 64)
        .references('entreprises.id')
        .notNullable()
      table.boolean('operateur')
      table.primary(['titreEtapeId', 'entrepriseId'])
    })
    .createTable('titresAdministrations', table => {
      table.string('titreEtapeId', 128).notNullable()
      table
        .foreign('titreEtapeId')
        .references('titresEtapes.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('administrationId', 64)
        .references('administrations.id')
        .notNullable()
      table.boolean('coordinateur')
      table.primary(['titreEtapeId', 'administrationId'])
    })
}

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('titresAdministrations')
    .dropTable('titresAmodiataires')
    .dropTable('titresTitulaires')
}
