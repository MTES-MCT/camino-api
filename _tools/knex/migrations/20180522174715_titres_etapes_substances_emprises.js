exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('titres_substances', table => {
      table
        .string('titre_demarche_etape_id', 128)
        .references('titres_demarches_etapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('substance_id', 4)
        .references('substances.id')
        .notNullable()
      table.boolean('connexe')
      table.integer('ordre')
      table.primary(['titre_demarche_etape_id', 'substance_id'])
    })
    .createTable('titres_emprises', table => {
      table
        .string('titre_demarche_etape_id', 128)
        .notNullable()
        .references('titres_demarches_etapes.id')
        .onDelete('CASCADE')
      table
        .string('emprise_id', 3)
        .notNullable()
        .references('emprises.id')
      table.primary(['titre_demarche_etape_id', 'emprise_id'])
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('titres_substances').dropTable('titres_emprises')
}
