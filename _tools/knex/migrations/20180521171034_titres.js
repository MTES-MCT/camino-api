exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('titres', table => {
      table.string('id', 32).primary()
      table.string('nom')
      table.string('typeId', 3)
      table.string('domaineId', 1)
      table.string('statutId', 3)
      table.string('travauxId', 3)
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('titres')])
}
