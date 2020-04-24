exports.up = knex =>
  knex.schema.createTable('titres', table => {
    table.string('id', 128).primary()
    table.string('nom').notNullable()
    table
      .string('typeId', 3)
      .references('titresTypes.id')
      .notNullable()
    table
      .string('domaineId', 1)
      .references('domaines.id')
      .notNullable()
    table
      .string('statutId', 3)
      .references('titresStatuts.id')
      .notNullable()
      .defaultTo('ind')
    table.string('dateDebut', 10)
    table.string('dateFin', 10)
    table.string('dateDemande', 10)
    table.boolean('publicLecture').defaultTo(false)
    table.boolean('entrepriseLecture').defaultTo(false)
    table.string('pointsTitreEtapeId', 128)
    table.string('titulairesTitreEtapeId', 128)
    table.string('amodiatairesTitreEtapeId', 128)
    table.string('administrationsTitreEtapeId', 128)
    table.string('surfaceTitreEtapeId', 128)
    table.string('substancesTitreEtapeId', 128)
    table.string('communesTitreEtapeId', 128)
    table.string('doublonTitreId', 128)
    table.jsonb('propsTitreEtapesIds')
  })

exports.down = knex => knex.schema.dropTable('titres')
