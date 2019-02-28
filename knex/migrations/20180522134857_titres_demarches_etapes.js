exports.up = knex => {
  return knex.schema
    .createTable('titresDemarches', table => {
      table.string('id', 128).primary()
      table
        .string('titreId', 128)
        .references('titres.id')
        .notNullable()
        .onDelete('CASCADE')
      table
        .string('typeId', 3)
        .notNullable()
        .references('demarchesTypes.id')
      table
        .string('statutId', 3)
        .notNullable()
        .references('demarchesStatuts.id')
      table.integer('ordre')
      table.string('annulationTitreDemarcheId', 128).references('id')
    })
    .createTable('titresDemarchesLiens', table => {
      table
        .string('enfantTitreDemarcheid', 128)
        .references('titresDemarches.id')
      table
        .string('parentTitreDemarcheid', 128)
        .references('titresDemarches.id')
      table.primary(['enfantTitreDemarcheid', 'parentTitreDemarcheid'])
    })
    .createTable('titresPhases', table => {
      table
        .string('titreDemarcheId', 128)
        .primary()
        .references('titresDemarches.id')
        .onDelete('CASCADE')
      table
        .string('statutId', 3)
        .notNullable()
        .references('phasesStatuts.id')
      table.date('dateDebut')
      table.date('dateFin')
    })
    .createTable('titresEtapes', table => {
      table.string('id', 128).primary()
      table
        .string('titreDemarcheId', 128)
        .references('titresDemarches.id')
        .notNullable()
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
      table.date('date').notNullable()
      table.date('dateDebut')
      table.date('dateFin')
      table.integer('duree')
      table.float('surface')
      table.float('volume')
      table.string('volumeUniteId').references('volumeUnites.id')
      table.specificType('visas', 'text[]')
      table.decimal('engagement', 14, 2)
      table.string('engagementDeviseId').references('devises.id')
      table.boolean('sourceIndisponible')
    })
    .alterTable('titres', table => {
      table
        .string('pointsTitreEtapeId', 128)
        .references('titresEtapes.id')
        .onDelete('CASCADE')
      table
        .string('titulairesTitreEtapeId', 128)
        .references('titresEtapes.id')
        .onDelete('CASCADE')
      table
        .string('amodiatairesTitreEtapeId', 128)
        .references('titresEtapes.id')
        .onDelete('CASCADE')
      table
        .string('administrationsTitreEtapeId', 128)
        .references('titresEtapes.id')
        .onDelete('CASCADE')
      table
        .string('surfaceTitreEtapeId', 128)
        .references('titresEtapes.id')
        .onDelete('CASCADE')
      table
        .string('volumeTitreEtapeId', 128)
        .references('titresEtapes.id')
        .onDelete('CASCADE')
      table
        .string('volumeUniteIdTitreEtapeId', 128)
        .references('titresEtapes.id')
        .onDelete('CASCADE')
      table
        .string('substancesTitreEtapeId', 128)
        .references('titresEtapes.id')
        .onDelete('CASCADE')
      table
        .string('communesTitreEtapeId', 128)
        .references('titresEtapes.id')
        .onDelete('CASCADE')
      table
        .string('engagementTitreEtapeId', 128)
        .references('titresEtapes.id')
        .onDelete('CASCADE')
      table
        .string('engagementDeviseIdTitreEtapeId', 128)
        .references('titresEtapes.id')
        .onDelete('CASCADE')
    })
}

exports.down = knex => {
  return knex.schema
    .alterTable('titres', table => {
      table.dropColumn('substancesTitreEtapeId')
      table.dropColumn('pointsTitreEtapeId')
      table.dropColumn('titulairesTitreEtapeId')
      table.dropColumn('amodiatairesTitreEtapeId')
      table.dropColumn('administrationsTitreEtapeId')
      table.dropColumn('surfaceTitreEtapeId')
      table.dropColumn('volumeTitreEtapeId')
      table.dropColumn('volumeUniteIdTitreEtapeId')
      table.dropColumn('communesTitreEtapeId')
      table.dropColumn('engagementTitreEtapeId')
      table.dropColumn('engagementDeviseIdTitreEtapeId')
    })
    .dropTable('titresEtapes')
    .dropTable('titresPhases')
    .dropTable('titresDemarchesLiens')
    .dropTable('titresDemarches')
}
