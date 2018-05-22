exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('titresDomaines', table => {
      table.string('id', 1).primary()
      table.string('nom')
    })
    .createTable('titresTypes', table => {
      table.string('id', 3).primary()
      table.string('nom')
    })
    .createTable('titresDomainesTypes', table => {
      table.string('domaineId', 1).references('titresDomaines.id')
      table.string('typeId', 3).references('titresTypes.id')
      table.primary(['domaineId', 'typeId'])
    })
    .createTable('titresTypesPhases', table => {
      table.string('typeId', 3).references('titresTypes.id')
      table.string('id', 8).primary()
      table.enum('nom', [
        'octroi',
        'prolongation',
        'prolongation 1',
        'prolongation 2',
        'prolongation exceptionnelle'
      ])
      table.integer('dureeMax')
      table.integer('position')
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
