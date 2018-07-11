exports.up = knex => {
  return knex.schema
    .createTable('titres_points', table => {
      table.string('id').primary()
      table
        .string('titre_etape_id', 128)
        .references('titres_etapes.id')
        .notNullable()
        .onDelete('CASCADE')
      table.specificType('coordonees', 'POINT').notNullable()
      table.integer('groupe').notNullable()
      table.integer('contour').notNullable()
      table.integer('point').notNullable()
      table.string('nom').notNullable()
    })
    .createTable('titres_points_references', table => {
      table.string('id').primary()
      table
        .string('titre_point_id')
        .references('titres_points.id')
        .onDelete('CASCADE')
      table.string('systeme', 128).notNullable()
      table.specificType('coordonees', 'POINT').notNullable()
    })
}

exports.down = knex => {
  return knex.schema
    .dropTable('titres_points_references')
    .dropTable('titres_points')
}
