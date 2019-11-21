exports.up = knex => {
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

    .createTable('titresAdministrationsGestionnaires', table => {
      table.string('titreId', 128).notNullable()
      table
        .foreign('titreId')
        .references('titres.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('administrationId', 64)
        .references('administrations.id')
        .notNullable()
      table.boolean('associee')
      table.primary(['titreId', 'administrationId'])
    })
    .createTable('titresAdministrationsLocales', table => {
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
      table.boolean('associee')
      table.boolean('coordinateur')
      table.primary(['titreEtapeId', 'administrationId'])
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('titresAdministrationsLocales')
    .dropTable('titresAdministrationsGestionnaires')
    .dropTable('titresAmodiataires')
    .dropTable('titresTitulaires')
}
