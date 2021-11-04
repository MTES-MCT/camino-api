exports.up = knex =>
  knex.schema
    .table('titresAdministrationsLocales', table =>
      table.dropColumn('coordinateur')
    )
    .createTable('titresAdministrations', table => {
      table.string('titreId', 128).notNullable().index()
      table
        .foreign('titreId')
        .references('titres.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('administrationId', 128)
        .index()
        .references('administrations.id')
        .notNullable()
      table.primary(['titreId', 'administrationId'])
    })

exports.down = () => ({})
