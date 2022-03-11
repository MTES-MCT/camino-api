import { Knex } from 'knex'

exports.up = async (knex: Knex) => {
  await knex.schema.table('titresAdministrationsLocales', table =>
    table.dropColumn('coordinateur')
  )

  return knex.schema.createTable('titresAdministrations', table => {
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
}

exports.down = () => ({})
