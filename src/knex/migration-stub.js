exports.up = knex =>
  knex.schema.createTable('matable', table => {
    table.string('id').primary()
  })

exports.down = () => ({})
