exports.up = async knex => {
  await knex('logs').delete()
  await knex.schema.renameTable('logs', 'journaux')

  return knex.schema.table('journaux', table => {
    table.string('titreId', 128).notNullable().index()
    table
      .foreign('titreId')
      .references('titres.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
  })
}

exports.down = () => ({})
