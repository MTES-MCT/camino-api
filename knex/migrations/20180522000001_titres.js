exports.up = knex => {
  return knex.schema.createTable('titres', table => {
    table.string('id', 128).primary()
    table.string('nom').notNullable()
    table.string('typeId', 3).notNullable()
    table.string('domaineId', 1).notNullable()
    table
      .string('statutId', 3)
      .notNullable()
      .defaultTo('ind')
    table.jsonb('references')
    table.date('dateDebut')
    table.date('dateFin')
    table.date('dateDemande')
    table.integer('activitesDeposees')
    table.integer('activitesEnConstruction')
    table.integer('activitesAbsentes')
    table.string('pointsTitreEtapeId', 128)
    table.string('titulairesTitreEtapeId', 128)
    table.string('amodiatairesTitreEtapeId', 128)
    table.string('administrationsTitreEtapeId', 128)
    table.string('surfaceTitreEtapeId', 128)
    table.string('volumeTitreEtapeId', 128)
    table.string('volumeUniteIdTitreEtapeId', 128)
    table.string('substancesTitreEtapeId', 128)
    table.string('communesTitreEtapeId', 128)
    table.string('engagementTitreEtapeId', 128)
    table.string('engagementDeviseIdTitreEtapeId', 128)
  })
}

exports.down = knex => {
  return knex.schema.dropTable('titres')
}
