exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('titresDomaines', table => {
      table.string('id', 1).primary()
      table.string('nom').notNullable()
    })
    .createTable('titresTypes', table => {
      table.string('id', 3).primary()
      table.string('nom').notNullable()
    })
    .createTable('titresDomainesTypes', table => {
      table
        .string('domaineId', 1)
        .references('titresDomaines.id')
        .notNullable()
      table
        .string('typeId', 3)
        .references('titresTypes.id')
        .notNullable()
      table.primary(['domaineId', 'typeId'])
    })
    .createTable('titresTypesPhases', table => {
      table.string('id', 8).primary()
      table
        .string('typeId', 3)
        .references('titresTypes.id')
        .notNullable()
      table
        .enum('nom', [
          'octroi',
          'prolongation',
          'prolongation 1',
          'prolongation 2',
          'prolongation exceptionnelle'
        ])
        .notNullable()
      table.integer('dureeMax').notNullable()
      table.integer('position').notNullable()
      table.boolean('renouvelable')
      table.boolean('exception')
    })
}

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('titresDomainesTypes')
    .dropTable('titresTypesPhases')
    .dropTable('titresDomaines')
    .dropTable('titresTypes')
}
