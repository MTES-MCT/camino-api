exports.up = knex => {
  return knex.schema.createTable('titresActivites', table => {
    table.string('id').primary()
    table
      .string('titreId', 128)
      .references('titres.id')
      .onDelete('CASCADE')
    table.string('utilisateurId', 128).references('utilisateurs.id')
    table.date('date')
    table.date('dateSaisie')
    table.jsonb('contenu')
    table
      .string('activiteTypeId', 3)
      .references('activitesTypes.id')
      .notNullable()
    table
      .string('activiteStatutId', 3)
      .references('activitesStatuts.id')
      .notNullable()
    table.integer('annee', 4)
    table.integer('frequencePeriodeId', 2)
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titresActivites')
}
