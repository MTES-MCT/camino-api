exports.up = knex => {
  return knex.schema
    .createTable('titresPoints', table => {
      table.string('id').primary()
      table.string('titreEtapeId', 128).notNullable()
      table
        .foreign('titreEtapeId')
        .references('titresEtapes.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.specificType('coordonnees', 'POINT').notNullable()
      table.integer('groupe').notNullable()
      table.integer('contour').notNullable()
      table.integer('point').notNullable()
      table.string('nom').notNullable()
      table.string('description', 1023)
      table.boolean('securite')
      table.boolean('subsidiaire')
    })
    .createTable('titresPointsReferences', table => {
      table.string('id').primary()
      table
        .string('titrePointId')
        .references('titresPoints.id')
        .onDelete('CASCADE')
      table.string('geoSystemeId', 5).notNullable()
      table.specificType('coordonnees', 'text[]').notNullable()
      table.boolean('opposable')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('titresPointsReferences')
    .dropTable('titresPoints')
}
