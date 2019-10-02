exports.up = knex => {
  return knex.schema
    .createTable('titresDemarches', table => {
      table.string('id', 128).primary()
      table.string('titreId', 128).notNullable()
      table
        .foreign('titreId')
        .references('titres.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('typeId', 3)
        .notNullable()
        .references('demarchesTypes.id')
      table
        .string('statutId', 3)
        .notNullable()
        .references('demarchesStatuts.id')
        .defaultTo('ind')
      table.integer('ordre').defaultTo('0')
      table.string('annulationTitreDemarcheId', 128).references('id')
      table.index('titreId')
      table.index('typeId')
      table.index('statutId')
    })
    .createTable('titresDemarchesLiens', table => {
      table.string('enfantTitreDemarcheId', 128)
      table
        .foreign('enfantTitreDemarcheId')
        .references('titresDemarches.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('parentTitreDemarcheId', 128)
      table
        .foreign('parentTitreDemarcheId')
        .references('titresDemarches.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.primary(['enfantTitreDemarcheId', 'parentTitreDemarcheId'])
      table.index('enfantTitreDemarcheId')
      table.index('parentTitreDemarcheId')
    })
    .createTable('titresPhases', table => {
      table.string('titreDemarcheId', 128).primary()
      table
        .foreign('titreDemarcheId')
        .references('titresDemarches.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('statutId', 3)
        .notNullable()
        .references('phasesStatuts.id')
      table.string('dateDebut', 10)
      table.string('dateFin', 10)
      table.index('statutId')
    })
    .createTable('titresEtapes', table => {
      table.string('id', 128).primary()
      table.string('titreDemarcheId', 128).notNullable()
      table
        .foreign('titreDemarcheId')
        .references('titresDemarches.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('typeId', 3)
        .notNullable()
        .references('etapesTypes.id')
      table
        .string('statutId', 3)
        .notNullable()
        .references('etapesStatuts.id')
      table.integer('ordre')
      table.string('date', 10).notNullable()
      table.string('dateDebut', 10)
      table.string('dateFin', 10)
      table.integer('duree')
      table.float('surface')
      table.float('volume')
      table.string('volumeUniteId').references('unites.id')
      table.float('engagement')
      table.string('engagementDeviseId').references('devises.id')
      table.boolean('sourceIndisponible')
      table.jsonb('contenu')
      table.index('titreDemarcheId')
      table.index('typeId')
      table.index('statutId')
      table.index('volumeUniteId')
      table.index('engagementDeviseId')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('titresEtapes')
    .dropTable('titresPhases')
    .dropTable('titresDemarchesLiens')
    .dropTable('titresDemarches')
}
