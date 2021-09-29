exports.up = knex =>
  knex.schema.createTable('logs', table => {
    table.string('id').primary()
    table.string('utilisateurId').index().notNullable()
    table.dateTime('date').notNullable()
    table.string('elementId').notNullable()
    table.enum('operation', ['create', 'update', 'delete']).notNullable()
    table.jsonb('differences').nullable()
  })

exports.down = knex => knex.schema.dropTable('logs')
