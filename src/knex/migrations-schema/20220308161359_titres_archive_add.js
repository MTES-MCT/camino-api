exports.up = async knex => {
  await knex.schema.alterTable('titres', function (table) {
    table.boolean('archive').defaultTo(false).notNullable()
  })
  await knex.schema.alterTable('titres_demarches', function (table) {
    table.boolean('archive').defaultTo(false).notNullable()
  })

  return knex.schema.alterTable('titres_etapes', function (table) {
    table.boolean('archive').defaultTo(false).notNullable()
  })
}

exports.down = () => ({})
