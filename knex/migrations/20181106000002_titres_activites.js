exports.up = knex =>
  knex.schema.createTable('titresActivites', table => {
    table.string('id').primary()
    table
      .string('titreId', 128)
      .references('titres.id')
      .onDelete('CASCADE')
    table.string('utilisateurId', 128).references('utilisateurs.id')
    table.string('date', 10)
    table.string('dateSaisie', 10)
    table.jsonb('contenu')
    table
      .string('typeId', 3)
      .references('activitesTypes.id')
      .notNullable()
    table
      .string('statutId', 3)
      .references('activitesStatuts.id')
      .notNullable()
    table.integer('annee', 4)
    table.integer('frequencePeriodeId', 2)
    table.index('titreId')
    table.index('utilisateurId')
    table.index('activiteTypeId')
    table.index('activiteStatutId')
  })

exports.down = knex => knex.schema.dropTable('titresActivites')
