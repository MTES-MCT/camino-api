exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('titresTitulaires', table => {
      table
        .string('titreEtapeId', 128)
        .references('titresEtapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('entrepriseId', 64)
        .references('entreprises.id')
        .notNullable()
      table.primary(['titreEtapeId', 'entrepriseId'])
    })
    .createTable('titres_amodiataires', table => {
      table
        .string('titreEtapeId', 128)
        .references('titresEtapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('entrepriseId', 64)
        .references('entreprises.id')
        .notNullable()
      table.primary(['titreEtapeId', 'entrepriseId'])
    })
    .createTable('titres_utilisateurs', table => {
      table
        .string('titreEtapeId', 128)
        .references('titresEtapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('utilisateurId', 4)
        .references('utilisateurs.id')
        .notNullable()
      table.primary(['titreEtapeId', 'utilisateurId'])
    })
    .createTable('titres_administrations', table => {
      table
        .string('titreEtapeId', 128)
        .references('titresEtapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('administrationId', 4)
        .references('administrations.id')
        .notNullable()
      table.primary(['titreEtapeId', 'administrationId'])
    })
}

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('titresUtilisateurs')
    .dropTable('titresAdministrations')
    .dropTable('titresAmodiataires')
    .dropTable('titresTitulaires')
}
