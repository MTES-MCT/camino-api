exports.up = knex => {
  return knex.schema
    .createTable('titresDemarches', table => {
      table.string('id', 128).primary()
      table.string('titreId', 128).notNullable().index()
      table
        .foreign('titreId')
        .references('titres.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('typeId', 3)
        .notNullable()
        .index()
        .references('demarchesTypes.id')
      table
        .string('statutId', 3)
        .notNullable()
        .index()
        .references('demarchesStatuts.id')
        .defaultTo('ind')
      table.boolean('publicLecture').defaultTo(false)
      table.boolean('entreprisesLecture').defaultTo(false)
      table.integer('ordre').defaultTo('0')
    })
    .createTable('titresDemarchesLiens', table => {
      table.string('enfantTitreDemarcheId', 128).index()
      table
        .foreign('enfantTitreDemarcheId')
        .references('titresDemarches.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('parentTitreDemarcheId', 128).index()
      table
        .foreign('parentTitreDemarcheId')
        .references('titresDemarches.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.primary(['enfantTitreDemarcheId', 'parentTitreDemarcheId'])
    })
    .createTable('titresPhases', table => {
      table.string('titreDemarcheId', 128).primary()
      table
        .foreign('titreDemarcheId')
        .references('titresDemarches.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('statutId', 3).notNullable().references('phasesStatuts.id')
      table.string('dateDebut', 10)
      table.string('dateFin', 10)
    })
    .createTable('titresEtapes', table => {
      table.string('id', 128).primary()
      table.string('titreDemarcheId', 128).notNullable().index()
      table
        .foreign('titreDemarcheId')
        .references('titresDemarches.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('typeId', 3)
        .notNullable()
        .index()
        .references('etapesTypes.id')
      table.string('arbreTypeId', 7)
      table
        .string('statutId', 3)
        .notNullable()
        .index()
        .references('etapesStatuts.id')
      table.integer('ordre')
      table.string('date', 10).notNullable()
      table.string('dateDebut', 10)
      table.string('dateFin', 10)
      table.integer('duree')
      table.float('surface')
      table.boolean('sourceIndisponible')
      table.jsonb('contenu')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('titresEtapes')
    .dropTable('titresPhases')
    .dropTable('titresDemarchesLiens')
    .dropTable('titresDemarches')
}
