exports.up = knex => {
  return knex.schema
    .createTable('titresPoints', table => {
      table.string('id').primary()
      table
        .string('titreEtapeId', 128)
        .references('titresEtapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table.specificType('coordonnees', 'POINT').notNullable()
      table.integer('groupe').notNullable()
      table.integer('contour').notNullable()
      table.integer('point').notNullable()
      table.string('nom').notNullable()
      table.string('description')
      table.boolean('securite')
    })
    .createTable('titresPointsReferences', table => {
      table.string('id').primary()
      table
        .string('titrePointId')
        .references('titresPoints.id')
        .onDelete('CASCADE')
      table.string('systeme', 128).notNullable()
      table.specificType('coordonnees', 'POINT').notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('titresPointsReferences')
    .dropTable('titresPoints')
}
