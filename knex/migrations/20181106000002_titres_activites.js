exports.up = knex =>
  knex.schema.createTable('titresActivites', table => {
    table.string('id').primary()
    table
      .string('titreId', 128)
      .index()
      .references('titres.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    table.string('utilisateurId', 128).index().references('utilisateurs.id')
    table.string('date', 10)
    table.string('dateSaisie', 10)
    table.jsonb('contenu')
    table.specificType('sections', 'jsonb[]')
    table
      .string('typeId', 3)
      .index()
      .references('activitesTypes.id')
      .notNullable()
    table
      .string('statutId', 3)
      .index()
      .references('activitesStatuts.id')
      .notNullable()
    table.integer('annee', 4)
    table.integer('periodeId', 2)
  })

exports.down = knex => knex.schema.dropTable('titresActivites')
