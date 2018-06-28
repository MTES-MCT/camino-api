exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('titres_titulaires', table => {
      table
        .string('titre_etape_id', 128)
        .references('titres_etapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('entreprise_id', 64)
        .references('entreprises.id')
        .notNullable()
      table.primary(['titre_etape_id', 'entreprise_id'])
    })
    .createTable('titres_amodiataires', table => {
      table
        .string('titre_etape_id', 128)
        .references('titres_etapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('entreprise_id', 64)
        .references('entreprises.id')
        .notNullable()
      table.primary(['titre_etape_id', 'entreprise_id'])
    })
    .createTable('titres_utilisateurs', table => {
      table
        .string('titre_etape_id', 128)
        .references('titres_etapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('utilisateur_id', 4)
        .references('utilisateurs.id')
        .notNullable()
      table.primary(['titre_etape_id', 'utilisateur_id'])
    })
    .createTable('titres_administrations', table => {
      table
        .string('titre_etape_id', 128)
        .references('titres_etapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('administration_id', 4)
        .references('administrations.id')
        .notNullable()
      table.primary(['titre_etape_id', 'administration_id'])
    })
}

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('titres_utilisateurs')
    .dropTable('titres_administrations')
    .dropTable('titres_amodiataires')
    .dropTable('titres_titulaires')
}
