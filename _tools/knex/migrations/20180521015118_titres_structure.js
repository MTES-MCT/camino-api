exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('titres_domaines', table => {
      table.string('id', 1).primary()
      table.string('nom')
    }),

    knex.schema.createTable('titres_types', table => {
      table.string('id', 3).primary()
      table.string('nom')
    }),

    knex.schema.createTable('titres_domaines_types', table => {
      table.string('domaine_id', 1).references('titres_domaines.id')
      table.string('type_id', 3).references('titres_types.id')
      table.primary(['domaine_id', 'type_id'])
    }),

    knex.schema.createTable('titres_types_phases', table => {
      table.string('id', 8).primary()
      table.enum('nom', [
        'octroi',
        'prolongation',
        'prolongation 1',
        'prolongation 2',
        'prolongation exceptionnelle'
      ])
      table.string('type_id', 3).references('titres_types.id')
      table.integer('duree')
      table.integer('position')
      table.boolean('renouvelable')
      table.boolean('exception')
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .dropTable('titres_domaines_types')
      .dropTable('titres_types_phases')
      .dropTable('titres_domaines')
      .dropTable('titres_types')
  ])
}
