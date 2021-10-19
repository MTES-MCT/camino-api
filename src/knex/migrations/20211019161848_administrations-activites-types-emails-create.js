exports.up = knex =>
  knex.schema.createTable('administrations__activitesTypes__emails', table => {
    table
      .string('activiteTypeId', 3)
      .index()
      .references('activitesTypes.id')
      .notNullable()
      .onDelete('CASCADE')
    table
      .string('administrationId', 64)
      .notNullable()
      .index()
      .references('administrations.id')
      .onDelete('CASCADE')
    table.string('email')
    table.primary(['administrationId', 'activiteTypeId', 'email'])
  })

exports.down = knex =>
  knex.schema.dropTable('administrations__activitesTypes__emails')
